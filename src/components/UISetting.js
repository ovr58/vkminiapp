import PropTypes from 'prop-types'
import { SiAdobefonts  } from "react-icons/si"
import { CiTextAlignCenter, CiTextAlignLeft, CiTextAlignRight } from "react-icons/ci"
import { BiColorFill } from "react-icons/bi"
import ListMenu from './ListMenu'
import { generateLineBreaks, getAllFonts } from '../utils'
import { Fragment, useCallback, useMemo, useState } from 'react'
import { ChromePicker } from 'react-color'
import { AiOutlineEnter } from 'react-icons/ai'
import { IoColorPaletteOutline } from 'react-icons/io5'
import { LiaImages } from 'react-icons/lia'
import { db, StoryData } from '../api'
import { eq } from 'drizzle-orm'
import { IoIosSave } from 'react-icons/io'

function UISetting({storyId, titleItem, setTitleState}) {

  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)

  const updateInDB = async (storyId, titleItem) => {
    const updatedData = {}
    titleItem.id === 'titleImage' ? updatedData.coverObjectImage = titleItem : updatedData.coverObjectText = titleItem

    try {
      const result = await db.update(StoryData)
        .set(updatedData)
        .where(eq(StoryData.storyId, storyId))
        .returning({ storyId: StoryData.storyId })
      return result
      } catch (error) {
        console.error('Error updating story in DB - ', error)
      }
  }

  const getUIItem = useCallback(() => {

    let UIItem

    switch (titleItem.id) {
      case 'titleImage':
        UIItem = [
          {
            name: 'Save',
            element: (children) =>
              <ListMenu 
                listOfValues = {[]} 
                listOfLabels = {[]} 
                setFunction={async () => await updateInDB(storyId, titleItem)}
                selected={null} 
              >
                {children}
              </ListMenu>,
              visual:[ 
                <IoIosSave key='SiAdobefonts' color='black' className='h-full w-auto hover:animate-bounce' />
              ],
          },
          {
            name: 'Frame',
            element: (children) => 
              <ListMenu 
                listOfValues = {[]} 
                listOfLabels = {[]} 
                setFunction={() => setTitleState((prevState) => {
                  const newTitleState = [...prevState]
                  const nodeIndex = newTitleState.findIndex((item) => item.id === titleItem.id)
                  newTitleState[nodeIndex] = {  
                    ...titleItem, 
                    colorGroups: {},
                    frameNumber: (titleItem.frameNumber % 11) + 1
                  }
                  return newTitleState
                })
                } 
                selected={null} 
              >
                {children}
            </ListMenu>,
            visual: [
              <LiaImages key='IoColorPaletteOutline' color='black' className='h-full w-auto hover:animate-bounce' />
            ],
          },
          {
            name: 'Colors',
            element: (children) =>
              <>
              <ListMenu 
                listOfValues = {Object.keys(titleItem.colorGroups)} 
                listOfLabels = {Object.keys(titleItem.colorGroups).map((item) => item.startsWith('fill') ? `Цвет заливки - ${titleItem.colorGroups[item]}` : `Цвет обводки - ${titleItem.colorGroups[item]}`)}
                setFunction={(item) => setIsColorPickerOpen(item)}
                selected={Object.keys(titleItem.colorGroups)[0]}
              >
                {children}
              </ListMenu>
              {isColorPickerOpen && 
              <ChromePicker 
                  key='colorPicker'
                  className='absolute top-14'
                  disableAlpha={true}
                  styles={{default: {picker: {boxShadow: 'none'}}}}
                  color={titleItem.colorGroups[isColorPickerOpen]}
                  onChangeComplete={(color) => {
                  setTitleState((prevState) => {
                    const newTitleState = [...prevState]
                    const nodeIndex = newTitleState.findIndex((item) => item.id === titleItem.id)
                    newTitleState[nodeIndex] = 
                    {
                        ...titleItem, 
                        colorGroups: 
                        {
                          ...titleItem.colorGroups,
                          [isColorPickerOpen]: color.hex, 
                        }
                    }
                    return newTitleState
                  }
                  )
                }} 
                onBlur={() => setIsColorPickerOpen(null)} 
              />
            }
            </>,
            visual: [
              <IoColorPaletteOutline key='IoColorPaletteOutline' color='black' className='h-full w-auto hover:animate-bounce' />
            ],
          }
        ]
        break;
      case 'titleText':
        UIItem = [
          {
            name: 'Save',
            element: (children) =>
              <ListMenu 
                listOfValues = {[]} 
                listOfLabels = {[]} 
                setFunction={async () => await updateInDB(storyId, titleItem)}
                selected={null} 
              >
                {children}
              </ListMenu>,
              visual:[ 
                <IoIosSave key='SiAdobefonts' color='black' className='h-full w-auto hover:animate-bounce' />
              ],
          },
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
                selected={titleItem.colorGroups.fillColor}
              >
                {children}
              </ListMenu>
              {isColorPickerOpen && 
              <ChromePicker 
                  key='colorPicker'
                  className='absolute top-14'
                  color={titleItem.colorGroups[isColorPickerOpen]}
                  disableAlpha={true}
                  styles={{default: {picker: {boxShadow: 'none'}}}}
                  onChangeComplete={(color) => {
                  setTitleState((prevState) => {
                    const newTitleState = [...prevState]
                    const nodeIndex = newTitleState.findIndex((item) => item.id === titleItem.id)
                    newTitleState[nodeIndex] = 
                    {
                        ...titleItem, 
                        colorGroups: 
                        {
                          ...titleItem.colorGroups,
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
    return UIItem

  }, [titleItem, setTitleState, isColorPickerOpen, storyId])

  const UIItem = useMemo(() => getUIItem(), [getUIItem])

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
    storyId: PropTypes.any,
    titleItem: PropTypes.object,
    setTitleState: PropTypes.func
}