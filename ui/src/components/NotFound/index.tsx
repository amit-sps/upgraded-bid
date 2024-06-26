import React from 'react';
import { Button, Result } from 'antd';

const NotFound: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                    <Button type="primary" onClick={() => window.location.href = '/'}>
                        Back Home
                    </Button>
                }
                className="p-10 rounded-lg w-full h-full"
            />
        </div>
    );
};

export default NotFound;
