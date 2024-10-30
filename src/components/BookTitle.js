import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Star, Text, Image } from 'react-konva'
import useImage from 'use-image'

function BookTitle({story}) {

  const stageRef = useRef()

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
    if (stageRef.current) {
      
      const container = document.querySelector('#cover-container')
      
      const parentWidth = container.offsetWidth
      console.log('PARENT WIDTH - ', parentWidth)
      const scaleW = 1

      stageRef.current.width(parentWidth)
      stageRef.current.scale({x: scaleW, y: 1})
    }
  }, [])

  return (
    <Stage ref={stageRef} width={300} height={400}>
      <Layer key='imageLayer'>
        {coverImage && <Image
          id='coverImage'
          image={coverImage}
          x={0}
          y={0}
          width={stageRef.current.width()}
          height={stageRef.current.height()}
        />}
      </Layer>
      <Layer key='titleLayer'>
        {stageRef.current && <Image
          id='titleImage' 
          image={frameImage} 
          x={stageRef.current.width()/2 - (stageRef.current.width()*0.4)} 
          y={stageRef.current.height()/2 - (stageRef.current.height()*0.4)/2}
          width={stageRef.current.width()*0.4}
          height={stageRef.current.height()*0.4} 
          draggable 
          rotation={titleState.frameAngle}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        /> }
        {frameImage && <Text 
          id='titleText'
          text={titleState.text} 
          x={titleState.x} 
          y={titleState.y}
          width={stageRef.current.width()*0.2}
          height={stageRef.current.width()*0.2} 
          draggable
          verticalAlign='middle' 
          align='center' 
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        /> }
      </Layer>
      
    </Stage>
  )
}

export default BookTitle

BookTitle.propTypes = {
    story: PropTypes.object,
    rect: PropTypes.any
}