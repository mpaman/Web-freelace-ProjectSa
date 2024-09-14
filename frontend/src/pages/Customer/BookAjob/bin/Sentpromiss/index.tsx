import React from 'react';
import { Button } from 'antd';
import { Card } from 'antd';
import { Input } from 'antd';
const { TextArea } = Input;



const PostPage: React.FC = () => {
    return (
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '60%' }}>

                <Card style={{ width: '90%', height: '80px', overflowY: 'auto' }}>
                    <div style={{ whiteSpace: 'pre-wrap', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>
                        สัญญา
                    </div>
                </Card>
                <TextArea
                    
                    style={{  
                        cursor: 'default',
                        color: '#000', 
                        fontWeight: 'bold', 
                        width: '90%', 
                        height: '600px'  }}
                />
            </div>



            <div style={{ width: '30%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

                <div style={{
                    position: 'fixed',
                    bottom: '70px',
                    right: '150px',
                    zIndex: 1000,
                }}>
                    <Button type="primary" style={{ width: '100px' }}>
                        ร่างสัญญา
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PostPage;
