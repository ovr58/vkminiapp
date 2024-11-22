import PropTypes from 'prop-types'
import { SiAdobefonts  } from "react-icons/si"
import { CiTextAlignCenter, CiTextAlignLeft, CiTextAlignRight } from "react-icons/ci"
import { BiColorFill } from "react-icons/bi"
import ListMenu from './ListMenu'
import { generateLineBreaks, getAllFonts } from '../utils'
import { useState } from 'react'
import { ChromePicker } from 'react-color'
import { AiOutlineEnter } from 'react-icons/ai'

function UISetting({titleItem, setTitleState}) {

  let UIItem

  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)

  switch (titleItem.id) {
    case 'titleImage':
      UIItem = []
      break;
    case 'titleText':
      UIItem = [
        {
          name: 'Font',
          element: (children) => 
            <ListMenu 
              listOfValues = {getAllFonts()} 
              listOfLabels = {getAllFonts().map((item) => <span key={`font-${item}`} className={`font-${item}`}>{item}</span>)} 
              setFunction={(item) => setTitleState((prevState) => {
                const newTitleState = [...prevState]
                const nodeIndex = newTitleState.findIndex((item) => item.id === titleItem.id)
                newTitleState[nodeIndex] = {
                  ...titleItem, 
                  font: item
                }
                return newTitleState
              })
              } 
              selected={titleItem.font} 
            >
              {children}
            </ListMenu>,
          visual:[ 
          ({color, classNameString}) => 
          <SiAdobefonts color={color} className={classNameString} />
        ], 
        },
        {
          name: 'Text Align', 
          element: (children) => 
            <ListMenu 
              listOfValues = {['left', 'center', 'right']} 
              listOfLabels = {['Лево', 'Центр', 'Право']} 
              setFunction={(item) => setTitleState((prevState) => {
                const newTitleState = [...prevState]
                const nodeIndex = newTitleState.findIndex((item) => item.id === titleItem.id)
                newTitleState[nodeIndex] = {  
                  ...titleItem, 
                  textAlign: item
                }
              
                return newTitleState
              })
              } 
              selected={titleItem.textAlign} 
            >
              {children}
            </ListMenu>, 
          visual: [
            ({color, classNameString}) => 
              <CiTextAlignLeft color={color} className={classNameString} />,
            ({color, classNameString}) => 
              <CiTextAlignCenter color={color} className={classNameString} />,
            ({color, classNameString}) => 
              <CiTextAlignRight color={color} className={classNameString} />,

          ].filter((item) => {
            const functionName = item({}).type.name.toLowerCase();
            return functionName.includes(titleItem.textAlign);
          }),
        },
        {
          name: 'Wrapper',
          element: (children) => 
          <>
            <ListMenu
              listOfValues = {[]}
              listOfLabels = {[]} 
              setFunction={() => setTitleState((prevState) => {
                const newTitleState = [...prevState]
                const nodeIndex = newTitleState.findIndex((item) => item.id === titleItem.id)
                newTitleState[nodeIndex] = {  
                  ...titleItem, 
                  text: generateLineBreaks(titleItem.text)[0]
                }
              
                return newTitleState
              })
              } 
              selected={null}
            >
              {children}
            </ListMenu>
          </>,
          visual: [
            ({color, classNameString}) => <AiOutlineEnter color={color} className={classNameString} />
          ],
        }, 
        {
          name: 'Fill Color',
          element: (children) => 
          <>
            <ListMenu
              listOfValues = {['fillColor', 'strokeColor']}
              listOfLabels = {['Цвет заливки', 'Цвет обводки']} 
              setFunction={(item) => setIsColorPickerOpen(item)}
              selected={titleItem.colorGroup.fillColor}
            >
              {children}
            </ListMenu>
            {isColorPickerOpen && 
            <ChromePicker 
                key='colorPicker'
                className='absolute top-15'
                color={titleItem.colorGroup[isColorPickerOpen]}
                onChangeComplete={(color) => {
                setTitleState((prevState) => {
                  const newTitleState = [...prevState]
                  const nodeIndex = newTitleState.findIndex((item) => item.id === titleItem.id)
                  newTitleState[nodeIndex] = 
                  {
                      ...titleItem, 
                      colorGroup: 
                      {
                        ...titleItem.colorGroup,
                        [isColorPickerOpen]: color.hex, 
                      }
                  }
                  return newTitleState
                }
                )
              }} 
              onBlur={() => setIsColorPickerOpen(null)} />
            }
          </>,
          visual: [
            ({color, classNameString}) => <BiColorFill color={color} className={classNameString} />
          ],
        },
      ]
      break;
    default:
      break;
  }
  return (
    <div className='absolute top-0'>
      <div className='flex flex-row gap-5 h-20 p-4 rounded-xl bg-neutral-400 justify-center'>
        {
          UIItem.map((item, i) => (
            <div key={`item${item.name}/${i}`}>
              {item.element(item.visual[0]('black', 'h-full w-auto hover:animate-bounce'))}
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default UISetting

UISetting.propTypes = {
    titleItem: PropTypes.object,
    setTitleState: PropTypes.func
}