import React, { useEffect, useCallback, useState } from 'react';
import { List, Avatar, Card, Button, Input, Row, Col, Modal } from 'antd';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getComments, createComment, deleteComment } from 'actions/comments';
import { COMMENT_PAGESIZE, getUid } from 'constants/index';
import styles from './index.module.scss';

const mapStateComments = state => state.comments;
const uid = getUid(); //uid has nothing to do with componet, so put it outside
const { confirm } = Modal;

const CommentsList = ({ id }) => {
    const dispatch = useDispatch();
    const [value, setValue] = useState('');
    const { comments = [], page = 0, total } = useMappedState(mapStateComments);
    //const { comments = [], page = 0 } = useMappedState(mapStateComments);
    console.log(comments);
    console.log(page);
    console.log(total);
    //const handleInfiniteOnLoad = useCallback(() => {
    //    dispatch(getComments({ id, page: page + 1, count: COMMENT_PAGESIZE }));
    //}, [dispatch, id, page]);
    const handleInfiniteOnLoad = () => {
        dispatch(getComments({ id, page: page + 1, count: COMMENT_PAGESIZE }));
    };

    useEffect(() => {
        handleInfiniteOnLoad();
    }, []);
    //const loadMore = page * COMMENT_PAGESIZE < total  && (
    const loadMore = (
        <div className={styles.loadMore}>
            <Button onClick={handleInfiniteOnLoad}>Loading More</Button>
        </div>
    );
    const handleSendComment= () => {
        let param = new URLSearchParams()
        param.append('id', id);
        param.append('comment', value);
        setValue('');
        dispatch(createComment(param, false));
    }

    const handleDeleteComment = (e, id) => {
        e.preventDefault();
        let param = new URLSearchParams();
        param.append('cid', id);
        confirm({
            title: 'Alert',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure to delete this comment?',
            onOk() {
                console.log(id);
                dispatch(deleteComment(param));
            }
        })
    }
    return (
        <Card className={styles.CommentsList}>
            <Row>
                <Col span={16}>
                    <Input value={value} onChange={(e) => setValue(e.target.value)}/>
                </Col>
                <Col span={8}>
                    <Button 
                        onClick={handleSendComment} 
                        type="primary"
                    >
                        Add Comment
                    </Button>
                </Col> 
            </Row>
            <List
                loadMore={loadMore}
                dataSource={comments}
                renderItem={({ user = {}, id, text, created_at }) => (
                    <List.Item 
                        key={id}
                        actions={
                            uid === user.idstr ?
                            [<a href="#!" onClick={(e) => handleDeleteComment(e, id)}>Delete</a>] : []
                        }
                    >
                        <List.Item.Meta
                            avatar={
                                <Avatar src={user.avatar_hd} />
                            }
                            title={
                                <div>
                                    <span>{user.name}</span>
                                    <span className={styles.extra}>
                                        {moment(created_at).fromNow()}
                                    </span>
                                </div>
                            }
                            description={text}
                        />
                    </List.Item>
                )}
            >
            </List>
        </Card>
    )
}

export default CommentsList;