import { forwardRef, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Image, Layer, Stage, Text, Transformer } from 'react-konva'
import HTMLFlipBook from 'react-pageflip'
import useImage from 'use-image'
import UISetting from './UISetting'
import WebFont from 'webfontloader'
import { getAllFonts } from '../utils'
import useSvgChanged from '../hooks/useChangedSvg'

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
    const frameImageRef = useRef()
    const titleTextRef = useRef()
    const transformerRef = useRef()

    const [titleState, setTitleState] = useState([story.coverObjectImage, story.coverObjectText])
    const titleStateRef = useRef(titleState)
    const [selectedId, setSelectedId] = useState(null)
    const [isFontsLoaded, setIsFontsLoaded] = useState(false)
    const [uiSetPosition, setUiSettingPosition] = useState({top: 0, left: 0})

    useEffect(() => {
        WebFont.load({
            google: {
                families: getAllFonts()
            },
            active: () => setIsFontsLoaded(true)
        })
        console.log('FONTS LOADED')
    }, [])

    const [frameImage] = useSvgChanged(`/frame00${titleState[0].frameNumber}.svg`, titleState, setTitleState)
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
        if (nodeIndex === 1) {
            newAttrs.fontSize = Math.max(10, node.fontSize() * scaleY)
        }
        onChange(newAttrs, nodeIndex)
    }

    const onChange = (newAttrs, nodeIndex) => {
        const newTitleState = [...titleStateRef.current]
        newTitleState[nodeIndex] = newAttrs
        if (JSON.stringify(titleStateRef.current) !== JSON.stringify(newTitleState)) {
            setTitleState(newTitleState)
            titleStateRef.current = newTitleState
            console.log('NEW TITLE STATE - ', newTitleState)
        }
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
        if (selectedId && transformerRef.current) {

            const stageNode = coverStageRef.current;
            const selectedNode = stageNode.findOne(`#${selectedId}`)
            if (selectedNode) {
                const box = selectedNode.getClientRect();
                const stageBox = stageNode.container().getBoundingClientRect();
                console.log('BOX - ', box, stageBox)
                let topPosition = stageBox.top + box.y + box.height;
                if (topPosition > stageBox.top + stageBox.height * 0.7) {
                    topPosition = stageBox.top + box.y - 120;
                }

                setUiSettingPosition({
                    top: topPosition,
                    left: stageBox.left + box.x + box.width / 2,
                });
            }
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
                        isSelected = {titleState[0].id === selectedId} 
                        draggable
                        onClick={() => setSelectedId(titleState[0].id)}
                        onTap={() => setSelectedId(titleState[0].id)}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onTransformEnd={handleTransformEnd}
                    /> }
                    {isFontsLoaded && <Text 
                        ref={titleTextRef}
                        id='titleText'
                        text={titleState[1].text}
                        fontFamily={titleState[1].font}
                        fontSize={titleState[1].fontSize}
                        x={titleState[1].x} 
                        y={titleState[1].y}
                        width={titleState[1].width}
                        height={titleState[1].height}
                        rotation={titleState[1].angle}
                        fill={titleState[1].colorGroups.fillColor}
                        stroke={titleState[1].colorGroups.strokeColor}
                        isSelected = {titleState[1].id === selectedId} 
                        draggable
                        onClick={() => setSelectedId(titleState[1].id)}
                        onTap={() => setSelectedId(titleState[1].id)}
                        verticalAlign='middle' 
                        align={titleState[1].textAlign}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onTransformEnd={handleTransformEnd}
                    />}
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
            {selectedId && isFontsLoaded &&
                <div
                    style={{
                    position: 'absolute',
                    top: `${uiSetPosition.top}px`,
                    left: `${uiSetPosition.left}px`,
                    transform: 'translateX(-50%)',
                    }}
                >     
                    <UISetting storyId={story.storyId} titleItem={titleState.filter(
                        (item) => item.id === selectedId
                    )[0]} setTitleState={setTitleState} />
                </div>
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