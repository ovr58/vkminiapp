import React, { forwardRef, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Image, Layer, Stage, Text } from 'react-konva'
import HTMLFlipBook from 'react-pageflip'
import useImage from 'use-image'

const Page = forwardRef(({children, story, index}, ref) => {
    return (
        <div ref={ref} className="w-full h-full bg-white" >
        <div className="page-content">
          <h2 className="page-header">Page header - {index}</h2>
          <div className="page-image"></div>
          <div className="page-text">{children}</div>
          <div className="page-footer">{index + 1}</div>
        </div>
      </div>
    )
})

const Cover = forwardRef(({story, boundingRect}, ref) => {

    const coverStageRef = useRef()

    const [titleState, setTitleState] = useState({
        x: 200,
        y: 250,
        frameScale: [1,1],
        textScale: [1,1],
        text: story.output.book_title,
        font: 0,
        frame: 1,
        frameColor: '#000',
        frameBackground: '#FFF',
        textColor: '#000',
        textAngle: 0,
        frameAngle: 0,
      })

    const [frameImage] = useImage(`/frame00${titleState.frame}.svg`)
    const [coverImage] = useImage(story.imgUrl)

    const [imageSize, setImageSize] = useState([300,400])
    const [imagePos, setImagePos] = useState([0,0])

    const handleDragStart = (e) => {
        const id = e.target.id()
        setTitleState(
        {
            ...titleState,
            isDragging: titleState.id === id,
        }
        )
    }
    const handleDragEnd = (e) => {
        const id = e.target.id()
        setTitleState(
        {
            ...titleState,
            isDragging: titleState.id === id,
        }
        )
    }
    useEffect(() => {
        if (coverStageRef.current && boundingRect && boundingRect.pageWidth && boundingRect.height) {
            const newWidth = boundingRect.pageWidth
            const ratio = coverImage ? coverImage.width/newWidth : 1
            const newHeight = coverImage ? coverImage.height / ratio : 400
            coverStageRef.current.width(newWidth)
            coverStageRef.current.height(boundingRect.height)
            setImagePos([0, boundingRect.height/2-newHeight/2])
            setImageSize([newWidth, newHeight])
        }
      }, [boundingRect, coverImage])

    return (
        <div ref={ref} id='cover-container' className='w-full h-auto bg-white'>
            <Stage ref={coverStageRef} width={300} height={400}>
                <Layer key='imageLayer'>
                    {coverImage && <Image
                    id='coverImage'
                    image={coverImage}
                    x={imagePos[0]}
                    y={imagePos[1]}
                    width={imageSize[0]}
                    height={imageSize[1]}
                    />}
                </Layer>
                <Layer key='titleLayer'>
                    {frameImage && <Image
                    id='titleImage' 
                    image={frameImage} 
                    x={0} 
                    y={0}
                    width={imageSize[0]*0.4}
                    height={imageSize[1]*0.4} 
                    draggable 
                    rotation={titleState.frameAngle}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    /> }
                    {frameImage && <Text 
                    id='titleText'
                    text={titleState.text} 
                    x={0} 
                    y={0}
                    width={imageSize[0]*0.4}
                    height={imageSize[1]*0.4}  
                    draggable
                    verticalAlign='middle' 
                    align='center' 
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    /> }
                </Layer>
            </Stage>
        </div>
    )
})

Cover.displayName = 'Cover'
Page.displayName = 'Page'

function FlipBook({ story }) {
    console.log('STORY - ', story)
    const coverRef = useRef()
    const pageRef = useRef()
    const flipBookRef = useRef()
    const [boundingRect, setBoundingRect] = useState({
        height: 400,
        left: 0,
        pageWidth: 300,
        top: 0,
        width: 600,
    })
    const handleInit = () => {
        setBoundingRect(flipBookRef.current.pageFlip().getBoundsRect());
    }

  return (
    <HTMLFlipBook
        ref={flipBookRef}
        width={300} 
        height={400} 
        size={"stretch"} 
        minHeight={400} 
        minWidth={300} 
        maxHeight={1024} 
        maxWidth={924}
        maxShadowOpacity={0.5}
        onInit={handleInit}
    >
        <Cover  ref={coverRef} story={story} boundingRect={boundingRect} />
        <Page  ref={pageRef} story={story} index={0}/>

    </HTMLFlipBook>
  )
}

export default FlipBook

Cover.propTypes = {
    story: PropTypes.object,
    boundingRect: PropTypes.shape({
        height: PropTypes.number,
        left: PropTypes.number,
        pageWidth: PropTypes.number,
        top: PropTypes.number,
        width: PropTypes.number,
    }),
}

Page.propTypes = {
    story: PropTypes.object,
    index: PropTypes.number
}

FlipBook.propTypes = {
    story: PropTypes.object,
}