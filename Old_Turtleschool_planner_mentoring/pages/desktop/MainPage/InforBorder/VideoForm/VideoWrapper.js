import React from 'react';

const VideoWrapper = () => {
    return (
        <>
        <div className='video_border'>
        <div className='vi_title'>
            <img src='/videos/video_title.jpg'></img>
        </div>
        <div className='vi_content'>
            <div className='video'>
                <video controls poster='videos/intro.jpg'>
                    <source src='videos/intro.mp4' type='video/mp4'></source>
                    <strong>Your browser does not support the video tag.</strong>
                </video>
            </div>
        </div>
    </div>
    <style jsx>{`
    
    .video_border {
        height: 650px;
        width: 1280px;
        margin: auto;
    }
    .video_border .vi_title {
        margin-top: 64px;
        font-size: 36px;
        height: 40px;
        text-align: center;
    }
    .video_border .vi_content {
        margin-top: 40px;
    }

    .video_border .vi_content .video {
        width: 895px;
        height: 470px;
        margin: 30px auto;
    }
    .video_border .vi_content .video video {
        width: 895px;
        height: 470px;
    }
    .video_border .vi_content .comment {
        width: 501px;
    }
    `}</style>
    </>
    );
};

export default VideoWrapper;