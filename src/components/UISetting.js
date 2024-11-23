import PropTypes from 'prop-types'
import { SiAdobefonts  } from "react-icons/si"
import { CiTextAlignCenter, CiTextAlignLeft, CiTextAlignRight } from "react-icons/ci"
import { BiColorFill } from "react-icons/bi"
import ListMenu from './ListMenu'
import { generateLineBreaks, getAllFonts } from '../utils'
import { Fragment, useState } from 'react'
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
            <SiAdobefonts key='SiAdobefonts' color='black' className='h-full w-auto hover:animate-bounce' />
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
            <CiTextAlignLeft key='CiTextAlignLeft' color='black' className='h-full w-auto hover:animate-bounce' />,
            <CiTextAlignCenter key='CiTextAlignCenter' color='black' className='h-full w-auto hover:animate-bounce' />,
            <CiTextAlignRight key='CiTextAlignRight' color='black' className='h-full w-auto hover:animate-bounce' />,
          ].filter((item) => {
            const functionName = item.type.name.toLowerCase();
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
            <AiOutlineEnter key='AiOutlineEnter' color='black' className='h-full w-auto hover:animate-bounce' />
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
            <BiColorFill key='BiColorFill' color='black' className='h-full w-auto hover:animate-bounce' />
          ],
        },
      ]
      break;
    default:
      break;
  }
  return (
    <div className='flex flex-row gap-5 h-14 p-2 rounded-xl bg-neutral-400 justify-center'>
      {
        UIItem.map((item, i) => (
          <Fragment key={`${item.name}/${i}`}>
            {
              item.element(
                item.visual[0]
              )
            }
          </Fragment>
        )
      )}
    </div>
  )
}

export default UISetting

UISetting.propTypes = {
    titleItem: PropTypes.object,
    setTitleState: PropTypes.func
}