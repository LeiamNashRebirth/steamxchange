"use client";
import { useEffect, useRef } from "react";
import Artplayer from "artplayer";

const Player = ({ url, poster, getInstance, ...rest }) => {
    const artRef = useRef(null);

    useEffect(() => {
        const art = new Artplayer({
            container: artRef.current,
            url: url, 
            poster: poster,
            theme: "#FFFFFF",
            autoplay: true,
            flip: true,
            playbackRate: true,
            aspectRatio: true,
            setting: true,
            lock: true,
            hotkey: true,
            fullscreenWeb: true,
            fullscreen: true,
            autoOrientation: true,
            type: "mp4",
            customType: {
             mp4: function (video, url) {
        video.src = url;
video.setAttribute("crossorigin", "anonymous");
        video.load();
        video.play();
  },
 },
});

if (getInstance && typeof getInstance === "function") {
            getInstance(art);
        }

        return () => {
            if (art) art.destroy(false);
        };
    }, [url]);

    return <div ref={artRef} {...rest}></div>;
};

export default Player;
