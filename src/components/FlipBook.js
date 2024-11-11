import React, { forwardRef, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Image, Layer, Stage, Text, Transformer } from 'react-konva'
import HTMLFlipBook from 'react-pageflip'
import useImage from 'use-image'
import UISetting from './UISetting'

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

const titleInitialSetting = [
    {
        id: 'titleImage',
        x: 0,
        y: 0,
        width: 200,
        height: 200,
        angle: 0,
        colorGroups: {},
        frameNumber: 1
    },
    {
        id: 'titleText',
        x: 0,
        y: 0,
        width: 200,
        height: 200,
        angle: 0,
        colorGroup: {
            borderColor: '#000',
            backgroundColor: '#000',
        },
        font: 'Arial',
        isInline: true,
        text: 'Волшебная сказка'
    },
]

const Cover = forwardRef(({story, boundingRect}, ref) => {

    const coverStageRef = useRef()
    const frameImageRef = useRef()
    const titleTextRef = useRef()
    const transformerRef = useRef()

    const [titleState, setTitleState] = useState(titleInitialSetting)
    const [selectedId, setSelectedId] = useState(null)

    const [frameImage] = useImage(`/frame00${titleState[0].frameNumber}.svg`)
    const [coverImage] = useImage(story.imgUrl)

    const [imageSize, setImageSize] = useState([300,400])
    const [imagePos, setImagePos] = useState([0,0])

    const handleDragStart = (e) => {
        const id = e.target.id()
        let nodeIndex
        switch (id) {
            case 'titleImage':
                nodeIndex = 0
                break;
            case 'titleText':
                nodeIndex = 1
                break;
            default:
                break;
        }
        onChange(
            {
                ...titleState[nodeIndex],
                isDragging: titleState[nodeIndex].id === id,
            }, 
            nodeIndex
        )
    }
    const handleDragEnd = (e) => {
        const id = e.target.id()
        let nodeIndex
        switch (id) {
            case 'titleImage':
                nodeIndex = 0
                break;
            case 'titleText':
                nodeIndex = 1
                break;
            default:
                break;
        }
        onChange(
            {
                ...titleState[nodeIndex],
                x: e.target.x(),
                y: e.target.y(),
                isDragging: titleState[nodeIndex].id === id,
            }, 
            nodeIndex
        )
    }

    const handleTransformEnd = () => {
        // transformer is changing scale of the node
        // and NOT its width or height
        // but in the store we have only width and height
        // to match the data better we will reset scale on transform end
        let node
        let nodeIndex
        console.log('TRANSFORM END')
        switch (selectedId) {
            case 'titleImage':
                node = frameImageRef.current
                nodeIndex = 0
                break;
            case 'titleText':
                node = titleTextRef.current
                nodeIndex = 1
                break;
            default:
                break;
        }
        const scaleX = node.scaleX()
        const scaleY = node.scaleY()

        // we will reset it back
        node.scaleX(1)
        node.scaleY(1)
        const newAttrs = {
            ...titleState[nodeIndex],
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
        }
        if (nodeIndex === 1) newAttrs.fontSize === node.fontSize(Math.max(10, node.fontSize() * scaleY))
        onChange(newAttrs, nodeIndex)
    }

    const onChange = (newAttrs, nodeIndex) => {
        setTitleState((prevState) => {
            const newTitleState = [...prevState]
            newTitleState[nodeIndex] = newAttrs
            return newTitleState
        })
    }
    const checkDeselect = (e) => {
        // deselect when clicked on empty area
        const clickedOnEmpty = !['titleImage', 'titleText'].includes(e.target.attrs.id)
        if (clickedOnEmpty) {
            if (e.target.attrs.name && !e.target.attrs.name.includes('anchor') || !e.target.attrs.name) {
                setSelectedId(null)
            }
        }
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

    useEffect(() => {
        if (selectedId) {
            switch (selectedId) {
                case 'titleImage':
                    transformerRef.current.nodes([frameImageRef.current])
                    transformerRef.current.getLayer().batchDraw()
                    break
                case 'titleText':
                    transformerRef.current.nodes([titleTextRef.current])
                    transformerRef.current.getLayer().batchDraw()
                    break
                default:
                    break
            }
        }
    }, [selectedId])

    return (
        <div ref={ref} id='cover-container' className='w-full h-auto bg-white'>
            <Stage 
                ref={coverStageRef} 
                width={300} 
                height={400}
                onMouseDown={(e) => checkDeselect(e)}
                onTouchStart={(e) => checkDeselect(e)}
            >
                <Layer key='coverImageLayer'>
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
                        ref={frameImageRef}
                        id='titleImage' 
                        image={frameImage} 
                        x={titleState[0].x}
                        y={titleState[0].y}
                        width={titleState[0].width}
                        height={titleState[0].height}
                        rotation={titleState[0].angle}
                        // fill={titleState[0].backgroundColor}
                        // stroke={titleState[0].borderColor}
                        isSelected = {titleState[0].id === selectedId} 
                        draggable
                        onClick={() => setSelectedId(titleState[0].id)}
                        onTap={() => setSelectedId(titleState[0].id)}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onTransformEnd={handleTransformEnd}
                    /> }
                    <Text 
                        ref={titleTextRef}
                        id='titleText'
                        text={titleState[1].text} 
                        x={titleState[1].x} 
                        y={titleState[1].y}
                        rotation={titleState[1].angle}
                        // fill={titleState[1].backgroundColor}
                        // stroke={titleState[1].borderColor}
                        isSelected = {titleState[1].id === selectedId} 
                        draggable
                        onClick={() => setSelectedId(titleState[1].id)}
                        onTap={() => setSelectedId(titleState[1].id)}
                        verticalAlign='middle' 
                        align='center'
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onTransformEnd={handleTransformEnd}
                    />
                    {selectedId && (
                        <>
                            <Transformer
                                ref={transformerRef}
                                flipEnabled={false}
                                boundBoxFunc={(oldBox, newBox) => {
                                    // limit resize
                                    if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                                    return oldBox;
                                    }
                                    return newBox;
                                }}
                            />
                        </>
                    )}
                </Layer>
            </Stage>
            {selectedId && 
                <UISetting titleItem={titleState[1]} setTitleState={setTitleState} />
            }
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
        setBoundingRect(flipBookRef.current.pageFlip().getBoundsRect())
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