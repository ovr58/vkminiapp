import PropTypes from 'prop-types'
import { SiAdobefonts, SiOpentext  } from "react-icons/si"
import { CiTextAlignCenter, CiTextAlignLeft, CiTextAlignRight } from "react-icons/ci"
import { VscSymbolColor } from "react-icons/vsc"
import { BiColorFill } from "react-icons/bi"
import ListMenu from './ListMenu'
import { getAllFonts } from '../utils'
import { useState } from 'react'
import { ChromePicker } from 'react-color'

function UISetting({titleItem, setTitleState}) {

  let UIItem

  switch (titleItem.id) {
    case 'titleImage':
      UIItem = []
      break;
    case 'titleText':
      UIItem = [
        {
          name: 'Font',
          element: (children) => <ListMenu 
                        listOfValues = {getAllFonts()} 
                        listOfLabels = {getAllFonts().map((item) => <span key={`font-${item}`} className={`font-${item}`}>{item}</span>)} 
                        setFunction={setTitleState} 
                        selected={titleItem.font} 
                      >{children}</ListMenu>,
          visual: [
            ({color, classNameString}) => <SiAdobefonts color={color} className={classNameString} />
          ], 
        },
        {
          name: 'Text Align', 
          element: (children) => <ListMenu 
                        listOfValues = {['left', 'center', 'right']} 
                        listOfLabels = {['Лево', 'Центр', 'Право']} 
                        setFunction={setTitleState} 
                        selected={titleItem.textAlign} 
                      >{children}</ListMenu>, 
          visual: [
            ({color, classNameString}) => <CiTextAlignLeft color={color} className={classNameString} />,
            ({color, classNameString}) => <CiTextAlignCenter color={color} className={classNameString} />,
            ({color, classNameString}) => <CiTextAlignRight color={color} className={classNameString} />,

          ],
        }, 
        {
          name: 'Fill Color',
          element: (children) => <ListMenu
            listOfValues = {['fillColor']}
            listOfLabels = {['Цвет заливки']} 
            setFunction={(props) => <ChromePicker 
              {...props}
              color={titleItem.colorGroup[0].fillColor}
              onChangeComplete={(color) => {
              setTitleState(
                {
                    ...titleItem, 
                    colorGroup: [
                    {
                      fillColor: color.hex, 
                      strokeColor: titleItem.colorGroup[0].strokeColor
                    }
                  ]
                }
              )
            }} />}
            selected={titleItem.colorGroup[0].fillColor}
          >{children}</ListMenu>,
          visual: [
            ({color, classNameString}) => <BiColorFill color={color} className={classNameString} />
          ],
        },
        {
          name: 'Stroke Color',
          element: (children) => <ListMenu 
            list = {['Цвет обводки']} 
            setFunction={() => <ChromePicker 
              {...props}
              color={titleItem.colorGroup[0].strokeColor}
              onChangeComplete={(color) => {
              setTitleState(
                {
                  ...titleItem, 
                  colorGroup: [
                    {
                      fillColor: titleItem.colorGroup[0].fillColor, 
                      strokeColor: color.hex
                    }
                  ]
                }
              )
            }} />} 
            selected={titleItem.colorGroup[0].fillColor}
          >{children}</ListMenu>,
          visual: [
            ({color, classNameString}) => <VscSymbolColor  color={color} className={classNameString} />
          ],
        }
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