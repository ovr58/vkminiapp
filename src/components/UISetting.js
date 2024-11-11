import PropTypes from 'prop-types'
import { SiAdobefonts, SiOpentext  } from "react-icons/si"
import { CiTextAlignCenter } from "react-icons/ci"
import { VscSymbolColor } from "react-icons/vsc"
import { BiColorFill } from "react-icons/bi"

function UISetting({titleItem, setTitleState}) {
  return (
    <div className='absolute top-0'>
      <div className='flex flex-row gap-5 h-20 p-4 rounded-xl bg-neutral-400 justify-center'>
        <SiAdobefonts color='black' className='h-full w-auto hover:animate-bounce' />
        {titleItem.isInLine ? 
          <SiOpentext color='black' className='h-full w-auto hover:animate-bounce'/> : 
          <CiTextAlignCenter color='black' className='h-full w-auto hover:animate-bounce'/>}
        <VscSymbolColor color='black' className='h-full w-auto hover:animate-bounce'/>
        <BiColorFill color='black' className='h-full w-auto hover:animate-bounce'/>
      </div>
    </div>
  )
}

export default UISetting

UISetting.propTypes = {
    titleItem: PropTypes.object,
}