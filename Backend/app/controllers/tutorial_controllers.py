from uuid import UUID
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import select, and_, update, func, case
from app.schemas.tutorial_schemas import (
    TutorialCreate, TutorialUpdate, TutorialResponse,
    TutorialViewCreate, TutorialViewResponse,
    TutorialRatingCreate, TutorialRatingUpdate, TutorialRatingResponse,
    TutorialStatsResponse
)
from app.models.tutorial import VideoTutorial, TutorialView, TutorialRating, TutorialCategory
from typing import List, Optional
from datetime import datetime


class TutorialControllers():
    @staticmethod
    async def create(data: TutorialCreate, db: AsyncSession):
        """Admin endpoint to create a new tutorial"""
        try:
            new_tutorial = VideoTutorial(
                name=data.name,
                description=data.description,
                url=data.url,
                category=data.category,
                language=data.language,
                thumbnail_url=data.thumbnail_url,
                duration_minutes=data.duration_minutes,
                is_active=True
            )
            
            db.add(new_tutorial)
            await db.commit()
            await db.refresh(new_tutorial)
            
            return new_tutorial
        
        except SQLAlchemyError as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Database error!')
        
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            raise HTTPException(
                status_code=error_dict.get('status_code', 500),
                detail=error_dict.get('detail', 'Internal server error!')
            )
    
    
    @staticmethod
    async def get_all(auth_id: UUID, category: Optional[TutorialCategory], language: Optional[str], db: AsyncSession):
        """Get all active tutorials with optional filtering"""
        try:
            query = select(VideoTutorial).where(VideoTutorial.is_active == True)
            
            # Filter by category if provided
            if category:
                query = query.where(VideoTutorial.category == category)
            
            # Filter by language if provided
            if language:
                from models.tutorial import TutorialLanguage
                if language.upper() == "URDU":
                    query = query.where(
                        VideoTutorial.language.in_([TutorialLanguage.URDU, TutorialLanguage.BOTH])
                    )
                elif language.upper() == "ENGLISH":
                    query = query.where(
                        VideoTutorial.language.in_([TutorialLanguage.ENGLISH, TutorialLanguage.BOTH])
                    )
            
            query = query.order_by(VideoTutorial.created_at.desc())
            
            result = await db.execute(query)
            tutorials = result.scalars().all()
            
            tutorial_responses = []
            
            for tutorial in tutorials:
                # Get rating stats
                rating_stats = await db.execute(
                    select(
                        func.avg(TutorialRating.rating).label('avg_rating'),
                        func.count(TutorialRating.id).label('total_ratings')
                    ).where(TutorialRating.tutorial_id == tutorial.id)
                )
                stats = rating_stats.first()
                avg_rating = float(stats.avg_rating) if stats.avg_rating else None
                total_ratings = stats.total_ratings
                
                # Get view count
                view_count_result = await db.execute(
                    select(func.count(TutorialView.id)).where(
                        TutorialView.tutorial_id == tutorial.id
                    )
                )
                total_views = view_count_result.scalar()
                
                # Check if user has rated
                user_rating_query = select(TutorialRating).where(
                    and_(
                        TutorialRating.tutorial_id == tutorial.id,
                        TutorialRating.user_id == auth_id
                    )
                )
                user_rating_result = await db.execute(user_rating_query)
                user_rating_obj = user_rating_result.scalar_one_or_none()
                
                tutorial_response = TutorialResponse(
                    id=tutorial.id,
                    name=tutorial.name,
                    description=tutorial.description,
                    url=tutorial.url,
                    category=tutorial.category,
                    language=tutorial.language,
                    thumbnail_url=tutorial.thumbnail_url,
                    duration_minutes=tutorial.duration_minutes,
                    is_active=tutorial.is_active,
                    created_at=tutorial.created_at,
                    average_rating=avg_rating,
                    total_ratings=total_ratings,
                    total_views=total_views,
                    user_has_rated=user_rating_obj is not None,
                    user_rating=user_rating_obj.rating if user_rating_obj else None
                )
                
                tutorial_responses.append(tutorial_response)
            
            return tutorial_responses
        
        except SQLAlchemyError as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Database error!')
        
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            raise HTTPException(
                status_code=error_dict.get('status_code', 500),
                detail=error_dict.get('detail', 'Internal server error!')
            )
    
    
    @staticmethod
    async def get_by_id(tutorial_id: UUID, auth_id: UUID, db: AsyncSession):
        """Get a specific tutorial by ID"""
        try:
            query = select(VideoTutorial).where(
                and_(
                    VideoTutorial.id == tutorial_id,
                    VideoTutorial.is_active == True
                )
            )
            
            result = await db.execute(query)
            tutorial = result.scalar_one_or_none()
            
            if not tutorial:
                raise HTTPException(status_code=404, detail='Tutorial not found')
            
            # Get rating stats
            rating_stats = await db.execute(
                select(
                    func.avg(TutorialRating.rating).label('avg_rating'),
                    func.count(TutorialRating.id).label('total_ratings')
                ).where(TutorialRating.tutorial_id == tutorial.id)
            )
            stats = rating_stats.first()
            avg_rating = float(stats.avg_rating) if stats.avg_rating else None
            total_ratings = stats.total_ratings
            
            # Get view count
            view_count_result = await db.execute(
                select(func.count(TutorialView.id)).where(
                    TutorialView.tutorial_id == tutorial.id
                )
            )
            total_views = view_count_result.scalar()
            
            # Check if user has rated
            user_rating_query = select(TutorialRating).where(
                and_(
                    TutorialRating.tutorial_id == tutorial.id,
                    TutorialRating.user_id == auth_id
                )
            )
            user_rating_result = await db.execute(user_rating_query)
            user_rating_obj = user_rating_result.scalar_one_or_none()
            
            tutorial_response = TutorialResponse(
                id=tutorial.id,
                name=tutorial.name,
                description=tutorial.description,
                url=tutorial.url,
                category=tutorial.category,
                language=tutorial.language,
                thumbnail_url=tutorial.thumbnail_url,
                duration_minutes=tutorial.duration_minutes,
                is_active=tutorial.is_active,
                created_at=tutorial.created_at,
                average_rating=avg_rating,
                total_ratings=total_ratings,
                total_views=total_views,
                user_has_rated=user_rating_obj is not None,
                user_rating=user_rating_obj.rating if user_rating_obj else None
            )
            
            return tutorial_response
        
        except SQLAlchemyError as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Database error!')
        
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            raise HTTPException(
                status_code=error_dict.get('status_code', 500),
                detail=error_dict.get('detail', 'Internal server error!')
            )
    
    
    @staticmethod
    async def update(tutorial_id: UUID, update_data: TutorialUpdate, db: AsyncSession):
        """Admin endpoint to update a tutorial"""
        try:
            query = select(VideoTutorial).where(VideoTutorial.id == tutorial_id)
            result = await db.execute(query)
            tutorial = result.scalar_one_or_none()
            
            if not tutorial:
                raise HTTPException(status_code=404, detail='Tutorial not found')
            
            update_dict = {}
            
            if update_data.name is not None:
                update_dict['name'] = update_data.name
            if update_data.description is not None:
                update_dict['description'] = update_data.description
            if update_data.url is not None:
                update_dict['url'] = update_data.url
            if update_data.category is not None:
                update_dict['category'] = update_data.category
            if update_data.language is not None:
                update_dict['language'] = update_data.language
            if update_data.thumbnail_url is not None:
                update_dict['thumbnail_url'] = update_data.thumbnail_url
            if update_data.duration_minutes is not None:
                update_dict['duration_minutes'] = update_data.duration_minutes
            if update_data.is_active is not None:
                update_dict['is_active'] = update_data.is_active
            
            if update_dict:
                update_dict['updated_at'] = datetime.utcnow()
                stmt = update(VideoTutorial).where(
                    VideoTutorial.id == tutorial_id
                ).values(**update_dict)
                
                await db.execute(stmt)
                await db.commit()
                await db.refresh(tutorial)
            
            return tutorial
        
        except SQLAlchemyError as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Database error!')
        
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            raise HTTPException(
                status_code=error_dict.get('status_code', 500),
                detail=error_dict.get('detail', 'Internal server error!')
            )
    
    
    @staticmethod
    async def delete(tutorial_id: UUID, db: AsyncSession):
        """Admin endpoint to delete a tutorial (soft delete)"""
        try:
            query = select(VideoTutorial).where(VideoTutorial.id == tutorial_id)
            result = await db.execute(query)
            tutorial = result.scalar_one_or_none()
            
            if not tutorial:
                raise HTTPException(status_code=404, detail='Tutorial not found')
            
            # Soft delete
            stmt = update(VideoTutorial).where(
                VideoTutorial.id == tutorial_id
            ).values(is_active=False, updated_at=datetime.utcnow())
            
            await db.execute(stmt)
            await db.commit()
            
            return {"message": "Tutorial deleted successfully"}
        
        except SQLAlchemyError as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Database error!')
        
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            raise HTTPException(
                status_code=error_dict.get('status_code', 500),
                detail=error_dict.get('detail', 'Internal server error!')
            )


class TutorialViewControllers():
    @staticmethod
    async def record_view(tutorial_id: UUID, auth_id: UUID, data: TutorialViewCreate, db: AsyncSession):
        """Record that a user viewed a tutorial"""
        try:
            # Verify tutorial exists
            tutorial_query = select(VideoTutorial).where(
                and_(
                    VideoTutorial.id == tutorial_id,
                    VideoTutorial.is_active == True
                )
            )
            tutorial_result = await db.execute(tutorial_query)
            tutorial = tutorial_result.scalar_one_or_none()
            
            if not tutorial:
                raise HTTPException(status_code=404, detail='Tutorial not found')
            
            # Create view record
            new_view = TutorialView(
                tutorial_id=tutorial_id,
                user_id=auth_id,
                watch_duration_minutes=data.watch_duration_minutes,
                completed=data.completed
            )
            
            db.add(new_view)
            await db.commit()
            await db.refresh(new_view)
            
            view_response = TutorialViewResponse(
                id=new_view.id,
                tutorial_id=new_view.tutorial_id,
                user_id=new_view.user_id,
                watched_at=new_view.watched_at,
                watch_duration_minutes=new_view.watch_duration_minutes,
                completed=new_view.completed
            )
            
            return view_response
        
        except SQLAlchemyError as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Database error!')
        
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            raise HTTPException(
                status_code=error_dict.get('status_code', 500),
                detail=error_dict.get('detail', 'Internal server error!')
            )
    
    
    @staticmethod
    async def get_user_views(auth_id: UUID, db: AsyncSession):
        """Get all tutorials viewed by the user"""
        try:
            query = select(TutorialView).where(
                TutorialView.user_id == auth_id
            ).order_by(TutorialView.watched_at.desc())
            
            result = await db.execute(query)
            views = result.scalars().all()
            
            view_responses = []
            for view in views:
                view_response = TutorialViewResponse(
                    id=view.id,
                    tutorial_id=view.tutorial_id,
                    user_id=view.user_id,
                    watched_at=view.watched_at,
                    watch_duration_minutes=view.watch_duration_minutes,
                    completed=view.completed
                )
                view_responses.append(view_response)
            
            return view_responses
        
        except SQLAlchemyError as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Database error!')
        
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            raise HTTPException(
                status_code=error_dict.get('status_code', 500),
                detail=error_dict.get('detail', 'Internal server error!')
            )


class TutorialRatingControllers():
    @staticmethod
    async def create_or_update(tutorial_id: UUID, auth_id: UUID, data: TutorialRatingCreate, db: AsyncSession):
        """Create or update a rating for a tutorial"""
        try:
            # Verify tutorial exists
            tutorial_query = select(VideoTutorial).where(
                and_(
                    VideoTutorial.id == tutorial_id,
                    VideoTutorial.is_active == True
                )
            )
            tutorial_result = await db.execute(tutorial_query)
            tutorial = tutorial_result.scalar_one_or_none()
            
            if not tutorial:
                raise HTTPException(status_code=404, detail='Tutorial not found')
            
            # Check if user has already rated
            existing_rating_query = select(TutorialRating).where(
                and_(
                    TutorialRating.tutorial_id == tutorial_id,
                    TutorialRating.user_id == auth_id
                )
            )
            existing_rating_result = await db.execute(existing_rating_query)
            existing_rating = existing_rating_result.scalar_one_or_none()
            
            if existing_rating:
                # Update existing rating
                stmt = update(TutorialRating).where(
                    TutorialRating.id == existing_rating.id
                ).values(
                    rating=data.rating,
                    review=data.review,
                    updated_at=datetime.utcnow()
                )
                
                await db.execute(stmt)
                await db.commit()
                await db.refresh(existing_rating)
                
                rating_response = TutorialRatingResponse(
                    id=existing_rating.id,
                    tutorial_id=existing_rating.tutorial_id,
                    user_id=existing_rating.user_id,
                    rating=existing_rating.rating,
                    review=existing_rating.review,
                    created_at=existing_rating.created_at,
                    updated_at=existing_rating.updated_at
                )
                
                return rating_response
            
            else:
                # Create new rating
                new_rating = TutorialRating(
                    tutorial_id=tutorial_id,
                    user_id=auth_id,
                    rating=data.rating,
                    review=data.review
                )
                
                db.add(new_rating)
                await db.commit()
                await db.refresh(new_rating)
                
                rating_response = TutorialRatingResponse(
                    id=new_rating.id,
                    tutorial_id=new_rating.tutorial_id,
                    user_id=new_rating.user_id,
                    rating=new_rating.rating,
                    review=new_rating.review,
                    created_at=new_rating.created_at,
                    updated_at=new_rating.updated_at
                )
                
                return rating_response
        
        except SQLAlchemyError as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Database error!')
        
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            raise HTTPException(
                status_code=error_dict.get('status_code', 500),
                detail=error_dict.get('detail', 'Internal server error!')
            )
    
    
    @staticmethod
    async def get_tutorial_ratings(tutorial_id: UUID, db: AsyncSession):
        """Get all ratings for a tutorial"""
        try:
            query = select(TutorialRating).where(
                TutorialRating.tutorial_id == tutorial_id
            ).order_by(TutorialRating.created_at.desc())
            
            result = await db.execute(query)
            ratings = result.scalars().all()
            
            rating_responses = []
            for rating in ratings:
                rating_response = TutorialRatingResponse(
                    id=rating.id,
                    tutorial_id=rating.tutorial_id,
                    user_id=rating.user_id,
                    rating=rating.rating,
                    review=rating.review,
                    created_at=rating.created_at,
                    updated_at=rating.updated_at
                )
                rating_responses.append(rating_response)
            
            return rating_responses
        
        except SQLAlchemyError as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Database error!')
        
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            raise HTTPException(
                status_code=error_dict.get('status_code', 500),
                detail=error_dict.get('detail', 'Internal server error!')
            )
    
    
    @staticmethod
    async def delete(tutorial_id: UUID, auth_id: UUID, db: AsyncSession):
        """Delete user's rating for a tutorial"""
        try:
            query = select(TutorialRating).where(
                and_(
                    TutorialRating.tutorial_id == tutorial_id,
                    TutorialRating.user_id == auth_id
                )
            )
            
            result = await db.execute(query)
            rating = result.scalar_one_or_none()
            
            if not rating:
                raise HTTPException(status_code=404, detail='Rating not found')
            
            await db.delete(rating)
            await db.commit()
            
            return {"message": "Rating deleted successfully"}
        
        except SQLAlchemyError as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Database error!')
        
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            raise HTTPException(
                status_code=error_dict.get('status_code', 500),
                detail=error_dict.get('detail', 'Internal server error!')
            )


class TutorialStatsControllers():
    @staticmethod
    async def get_stats(db: AsyncSession):
        """Get overall tutorial statistics"""
        try:
            # Total tutorials
            total_tutorials_result = await db.execute(
                select(func.count(VideoTutorial.id)).where(
                    VideoTutorial.is_active == True
                )
            )
            total_tutorials = total_tutorials_result.scalar()
            
            # Total views
            total_views_result = await db.execute(
                select(func.count(TutorialView.id))
            )
            total_views = total_views_result.scalar()
            
            # Total ratings
            total_ratings_result = await db.execute(
                select(func.count(TutorialRating.id))
            )
            total_ratings = total_ratings_result.scalar()
            
            # Average rating
            avg_rating_result = await db.execute(
                select(func.avg(TutorialRating.rating))
            )
            avg_rating = avg_rating_result.scalar()
            
            # Tutorials by category
            category_stats = await db.execute(
                select(
                    VideoTutorial.category,
                    func.count(VideoTutorial.id).label('count')
                ).where(
                    VideoTutorial.is_active == True
                ).group_by(VideoTutorial.category)
            )
            
            tutorials_by_category = {
                str(row.category.value): row.count 
                for row in category_stats.all()
            }
            
            stats = TutorialStatsResponse(
                total_tutorials=total_tutorials,
                total_views=total_views,
                total_ratings=total_ratings,
                average_rating=float(avg_rating) if avg_rating else None,
                tutorials_by_category=tutorials_by_category
            )
            
            return stats
        
        except SQLAlchemyError as e:
            await db.rollback