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
      // const container = document.querySelector('#cover-container')
      
      // const parentWidth = container.offsetWidth
      
      // const scale = parentWidth / 400

      // stageRef.current.width(400*scale)
      // stageRef.current.height(400*scale)
      // stageRef.current.scale({x: scale, y: scale})
    }
  }, [])

  return (
    <Stage ref={stageRef} className='absolute w-full h-full left-0 top-0 mx-auto z-50 justify-center' width={400} height={400}>
      <Layer>
        <Image
          id='titleImage' 
          image={frameImage} 
          x={titleState.x} 
          y={titleState.y}
          width={300}
          height={300} 
          draggable 
          rotation={titleState.frameAngle}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
        <Text 
          id='titleText'
          text={titleState.text} 
          x={titleState.x} 
          y={titleState.y}
          width={300}
          height={300} 
          draggable
          verticalAlign='middle' 
          align='center' 
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      </Layer>
    </Stage>
  )
}

export default BookTitle

BookTitle.propTypes = {
    story: PropTypes.object
}