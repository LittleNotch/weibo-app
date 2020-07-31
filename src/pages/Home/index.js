import React, { useEffect } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';
import moment from 'moment';
import { Card } from 'antd';
import { RetweetOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons';
import { getHomeTimeline } from '../../actions/timeline';
import styles from './index.module.scss';

const mapStateTimneline = state => state.timeline;

const getPostTitle = (
    user,
    created_at,
    source
) => (
        <div className={styles.user}>
            <img
                src={user.profile_image_url}
                className={styles.avatar}
                alt={user.screen_name}
            />
            <div className={styles.userInfo}>
                <div>{user.screen_name}</div>
                <div className={styles.extra}>
                    {moment(created_at).fromNow()} From <span dangerouslySetInnerHTML={{ __html: source }} />
                </div>
            </div>
        </div>
    )

const Home = () => {
    const dispatch = useDispatch();
    const { home = [] } = useMappedState(mapStateTimneline);
    useEffect(() => {
        dispatch(getHomeTimeline());
    }, [dispatch]);
    return (
        <div className={styles.container}>
            {
                home.map(({
                    id,
                    text,
                    user,
                    created_at,
                    source,
                    pic_urls,
                    reposts_count,
                    attitudes_count,
                    comments_count,
                }) => (
                        <Card
                            className={styles.post}
                            key={id}
                            bordered={false}
                            hoverable
                            title={
                                getPostTitle(
                                    user,
                                    created_at,
                                    source,
                                )
                            }
                            actions={[
                                <div>
                                    <RetweetOutlined key="retweet" />
                                    <span>{reposts_count || ''}</span>
                                </div>,
                                <div>
                                    <LikeOutlined key="like" />
                                    <span>{attitudes_count || ''}</span>
                                </div>,
                                <div>
                                    <MessageOutlined key="message" />
                                    <span>{comments_count || ''}</span>
                                </div>,
                        ]}
                        >
                            <div className={styles.content}>
                                <div className={styles.text}>
                                    {text}
                                </div>
                                <ul className={styles.images}>
                                    {
                                        pic_urls.map(({ thumbnail_pic }) => (
                                            <li key={thumbnail_pic} className={styles.imgWrapper}>
                                                <div className={styles.imgContainer}>
                                                    <img src={thumbnail_pic} alt={thumbnail_pic} />
                                                </div>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </Card>
                    ))
            }
        </div>
    );
};

export default Home;