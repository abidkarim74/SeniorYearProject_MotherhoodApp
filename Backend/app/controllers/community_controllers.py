from uuid import UUID
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import select, and_, update, or_
from sqlalchemy.orm import selectinload
from schemas.community_schemas import PostCreate, PostUpdate, PostChangeVisiblity, PostResponse
from models.community import Post, PostLike
from typing import List
from datetime import date, timedelta, datetime
from models.user import User
from sqlalchemy import func
from schemas.community_schemas import MiniUserSchema
from schemas.community_schemas import PostChangeVisiblity
from models.user import User
from models.community import Post


class PostControllers():
    @staticmethod
    async def create(auth_id: UUID, data: PostCreate, db: AsyncSession):
        try:
            new_post = Post(
                user_id=auth_id,
                title=data.title,
                tags=data.tags,
                images=data.images,
                description=data.description,
                post_type=data.post_type,
                visible=True,
                post_category="Chidren"
            )
            
            db.add(new_post)
            await db.commit()
            await db.refresh(new_post)
            
            return new_post
        
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
    async def auth_posts(auth_id: UUID, db: AsyncSession):
        try:
            query = select(Post, User).join(
                User, Post.user_id == User.id
            ).where(
                and_(
                    Post.user_id == auth_id,
                )
            ).order_by(Post.created_at.desc())

            result = await db.execute(query)
            rows = result.all()
            
            post_responses = []
            
            for post, user in rows:
                like_query = select(PostLike).where(PostLike.post_id == post.id)
                like_result = await db.execute(like_query)
                like_count = len(like_result.scalars().all())
                
                mini_user = MiniUserSchema(
                    firstname=user.firstname,
                    lastname=user.lastname,
                    username=user.username,
                    profile_pic=user.profile_pic
                )
                
                post_response = PostResponse(
                    id=post.id,
                    post_type=post.post_type.value,
                    visible=post.visible,
                    post_category=post.post_category,
                    like_count=like_count,
                    tags=post.tags,
                    images=post.images,
                    title=post.title,
                    created_at=post.created_at,
                    description=post.description,
                    user_id=post.user_id,
                    user=mini_user  
                )
                post_responses.append(post_response)
            
            return post_responses
        
        except SQLAlchemyError:
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
    async def other_posts(auth_id: UUID, db: AsyncSession):
        try:
            query = select(Post, User).join(
                User, Post.user_id == User.id
            ).where(
                and_(
                    Post.user_id != auth_id,
                    Post.visible == True
                )
            ).order_by(Post.created_at.desc())
            
            result = await db.execute(query)
            rows = result.all()
            
            post_responses = []
            
            for post, user in rows:
                like_query = select(PostLike).where(PostLike.post_id == post.id)
                like_result = await db.execute(like_query)
                
                like_count = len(like_result.scalars().all())
                
                mini_user = MiniUserSchema(
                    firstname=user.firstname,
                    lastname=user.lastname,
                    username=user.username,
                    profile_pic=user.profile_pic
                )
                
                post_response = PostResponse(
                    id=post.id,
                    post_type=post.post_type.value,
                    visible=post.visible,
                    post_category=post.post_category,
                    like_count=like_count,
                    tags=post.tags,
                    images=post.images,
                    title=post.title,
                    created_at=post.created_at,
                    description=post.description,
                    user_id=post.user_id,
                    user=mini_user  
                )
                
                post_responses.append(post_response)
            
            return post_responses
        
        except SQLAlchemyError:
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
    async def detail(post_id: UUID, auth_id: UUID, db: AsyncSession):
        try:
            query = select(Post, User).join(
                User, Post.user_id == User.id
            ).where(
                and_(
                    Post.id == post_id,
                    Post.visible == True,
                    or_(
                        Post.user_id == auth_id,  
                        Post.user_id != auth_id   
                    )
                )
            )
            
            result = await db.execute(query)
            row = result.first()
            
            if not row:
                raise HTTPException(status_code=404, detail='Post not found or not visible')
            
            post, user = row
            
            like_query = select(PostLike).where(
                and_(
                    PostLike.post_id == post_id,
                    PostLike.user_id == auth_id
                )
            )
            like_result = await db.execute(like_query)
            user_liked = like_result.scalar_one_or_none() is not None
            
            total_likes_query = select(PostLike).where(PostLike.post_id == post_id)
            
            total_likes_result = await db.execute(total_likes_query)
            like_count = len(total_likes_result.scalars().all())
            
            mini_user = MiniUserSchema(
                firstname=user.firstname,
                lastname=user.lastname,
                username=user.username,
                profile_pic=user.profile_pic
            )
            
            post_response = PostResponse(
                id=post.id,
                post_type=post.post_type.value,
                visible=post.visible,
                post_category=post.post_category,
                like_count=like_count,
                tags=post.tags,
                created_at=post.created_at,
                images=post.images,
                title=post.title,
                description=post.description,
                user_id=post.user_id,
                user=mini_user  
            )
            
            post_detail = {
                **post_response.model_dump(),
                "user_liked": user_liked,
                "is_owner": post.user_id == auth_id
            }
            
            return post_detail
        
        except SQLAlchemyError:
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
    async def update(post_id: UUID, auth_id: UUID, update_data: PostUpdate, db: AsyncSession):
        try:
            query = select(Post, User).join(
                User, Post.user_id == User.id
            ).where(
                and_(
                    Post.id == post_id,
                    Post.user_id == auth_id
                )
            )
            
            result = await db.execute(query)
            row = result.first()
            
            if not row:
                raise HTTPException(status_code=404, detail='Post not found or you do not have permission to edit it')
            
            post, user = row
            
            update_dict = {}
            
            if update_data.description is not None:
                update_dict['description'] = update_data.description
            
            if update_dict:
                stmt = update(Post).where(Post.id == post_id).values(**update_dict)
                
                await db.execute(stmt)
                await db.commit()
                await db.refresh(post)
            
            like_query = select(PostLike).where(PostLike.post_id == post_id)
            like_result = await db.execute(like_query)
            
            like_count = len(like_result.scalars().all())
            
            mini_user = MiniUserSchema(
                firstname=user.firstname,
                lastname=user.lastname,
                username=user.username,
                profile_pic=user.profile_pic
            )
            
            post_response = PostResponse(
                id=post.id,
                post_type=post.post_type.value,
                visible=post.visible,
                post_category=post.post_category,
                like_count=like_count,
                tags=post.tags,
                images=post.images,
                title=post.title,
                description=post.description,
                user_id=post.user_id,
                user=mini_user,
                created_at=post.created_at
            )
            
            return post_response
        
        except SQLAlchemyError:
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
    async def change_visibility(post_id: UUID, auth_id: UUID, visibility_data: PostChangeVisiblity, db: AsyncSession):
        try:
            query = select(Post, User).join(
                User, Post.user_id == User.id
            ).where(
                and_(
                    Post.id == post_id,
                    Post.user_id == auth_id
                )
            )
            
            result = await db.execute(query)
            row = result.first()
            
            if not row:
                raise HTTPException(status_code=404, detail='Post not found or you do not have permission to modify it')
            
            post, user = row
            
            if visibility_data.visible is not None:
                stmt = update(Post).where(Post.id == post_id).values(visible=visibility_data.visible)
                
                await db.execute(stmt)
                await db.commit()
                await db.refresh(post)
            
            like_query = select(PostLike).where(PostLike.post_id == post_id)
            like_result = await db.execute(like_query)
            
            like_count = len(like_result.scalars().all())
            
            mini_user = MiniUserSchema(
                firstname=user.firstname,
                lastname=user.lastname,
                username=user.username,
                profile_pic=user.profile_pic
            )
            
            post_response = PostResponse(
                id=post.id,
                post_type=post.post_type.value,
                visible=post.visible,
                post_category=post.post_category,
                like_count=like_count,
                tags=post.tags,
                images=post.images,
                title=post.title,
                description=post.description,
                user_id=post.user_id,
                user=mini_user,
                created_at=post.created_at
            )
            
            return post_response
        
        except SQLAlchemyError:
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
    async def delete(post_id: UUID, auth_id: UUID, db: AsyncSession):
        try:
            query = select(Post).where(
                and_(
                    Post.id == post_id,
                    Post.user_id == auth_id
                )
            )
            
            result = await db.execute(query)
            post = result.scalar_one_or_none()
            
            if not post:
                raise HTTPException(status_code=404, detail='Post not found or you do not have permission to delete it')
            
            await db.delete(post)
            await db.commit()
            
            return {"message": "Post deleted successfully"}
        
        except SQLAlchemyError:
            await db.rollback()
            
            raise HTTPException(status_code=500, detail='Database error!')
        
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            
            raise HTTPException(
                status_code=error_dict.get('status_code', 500), 
                detail=error_dict.get('detail', 'Internal server error!')
            )
    
    
class PostLikeControllers():
    @staticmethod
    async def toggle_like(post_id: UUID, auth_id: UUID, db: AsyncSession):
        try:
            post_query = select(Post).where(
                and_(
                    Post.id == post_id,
                    Post.visible == True
                )
            )
            post_result = await db.execute(post_query)
            post = post_result.scalar_one_or_none()
            
            if not post:
                raise HTTPException(status_code=404, detail='Post not found or not visible')
            
            like_query = select(PostLike).where(
                and_(
                    PostLike.post_id == post_id,
                    PostLike.user_id == auth_id
                )
            )
            like_result = await db.execute(like_query)
            existing_like = like_result.scalar_one_or_none()
            
            if existing_like:
                await db.delete(existing_like)
                await db.commit()
                
                return {"liked": False, "message": "Post unliked"}
            
            else:
                new_like = PostLike(post_id=post_id, user_id=auth_id)
                db.add(new_like)
                await db.commit()
                return {"liked": True, "message": "Post liked"}
        
        except SQLAlchemyError:
            await db.rollback()
            
            raise HTTPException(status_code=500, detail='Database error!')
        
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            
            raise HTTPException(
                status_code=error_dict.get('status_code', 500), 
                detail=error_dict.get('detail', 'Internal server error!')
            )
            
    
class CommunityStatsControllers():
    @staticmethod
    async def totol_members(db: AsyncSession):
        try:
            statement = select(func.count()).select_from(User)
            
            result = await db.execute(statement)
            
            return result.scalar_one()
            
        except SQLAlchemyError:
            await db.rollback()
            
            raise HTTPException(status_code=500, detail='Internal server error!')
        
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            
            raise HTTPException(status_code=error_dict.get('status_code', 500), detail=error_dict.get('detail', 'Internal server error!'))
        
        
    @staticmethod
    async def today_posts_count(db: AsyncSession):
        try:
            twenty_four_hours_ago = datetime.now() - timedelta(hours=24)
        
            statement = select(func.count()).select_from(Post).where(
                Post.created_at >= twenty_four_hours_ago
            )
            
            result = await db.execute(statement)
            count = result.scalar_one()
            
            return count
        
        except SQLAlchemyError:
            await db.rollback()
            
            raise HTTPException(status_code=500, detail='Database error!')
        
        except HTTPException as e:
            await db.rollback()
            error_dict = e.__dict__
            
            raise HTTPException(status_code=error_dict.get('status_code', 500), detail=error_dict.get('detail', 'Internal server error!'))
            
