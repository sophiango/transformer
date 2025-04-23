function VideoView() {
    return (
        <div>
            <video
                id="my-video"
                className="video-js vjs-theme-city w-full"
                controls
                preload="auto"
                poster="MY_VIDEO_POSTER.jpg"
                data-setup="{}"
            >
                <source src="MY_VIDEO.webm" type="video/webm"/>
                <p className="vjs-no-js">
                    To view this video please enable JavaScript, and consider upgrading to a
                    web browser that
                    <a href="https://videojs.com/html5-video-support/" target="_blank"
                    >supports HTML5 video</a
                    >
                </p>
            </video>
        </div>
    )
}

export default VideoView