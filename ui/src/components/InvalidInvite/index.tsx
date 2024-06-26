import React from 'react';
import { Button, Result } from 'antd';

const InvalidInvite: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Result
                status="error"
                title="Invalid or Expired Invite"
                subTitle="Sorry, the invite link you used is either invalid or has expired. Please contact the team administrator for a new invite."
                // extra={[
                //     <Button type="primary" key="console" onClick={() => window.location.href = '/'}>
                //         Go to Homepage
                //     </Button>,
                //     <Button key="contact" onClick={() => window.location.href = 'mailto:support@example.com'}>
                //         Contact Support
                //     </Button>,
                // ]}
                className="bg-white p-10 rounded-lg shadow-lg"
            />
        </div>
    );
};

export default InvalidInvite;
