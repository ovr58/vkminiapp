import { useState, useEffect, useRef } from 'react';
import { getSvgChanged } from '../utils';

const useSvgChanged = (svgPath, titleState, setTitleState) => {
  
    const [image, setImage] = useState(null)
    const prevTitleStateRef = useRef();

    useEffect(() => {
        let updatedSvg = '';
        const loadSvg = async () => {
            updatedSvg = await getSvgChanged(svgPath, titleState, setTitleState);
            const img = new window.Image();
            img.src = 'data:image/svg+xml;base64,' + btoa(updatedSvg);
            img.onload = () => {
                setImage(img);
            };
        };

        if (JSON.stringify(prevTitleStateRef.current) !== JSON.stringify(titleState)) {

            loadSvg();
            prevTitleStateRef.current = titleState;

        }
    }, [svgPath, titleState, setTitleState]);
    return [image];
};

export default useSvgChanged;