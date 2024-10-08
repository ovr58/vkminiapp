import { Div, FormItem, Image } from "@vkontakte/vkui"
import { useState } from "react"
import { dawnloadImg, generateImg, readyImg } from "../assets"
import PropTypes from 'prop-types'

function CoverImg({userPromt}) {

    const optionsList = [
        {
            label: 'Генерация',
            image: generateImg,
            isFree: false
        },
        {
            label: 'Загрузить',
            image: dawnloadImg,
            isFree: true
        },
        {
            label: 'Готовые',
            image: readyImg,
            isFree: true
        },
    ]

    const [selectedOption, setSelectedOption] = useState(1)

  return (
    <FormItem top="Обложка">
        <label>Создайте обложку для Ваше книжки.</label>
        <Div className='grid grid-cols-3'>
            {optionsList.map((item, index) => (
                <div 
                    key={`${index}_${item.label}`} 
                    onClick={() => (
                        setSelectedOption(index),
                        userPromt({
                            coverImg: item.label
                        }) 
                    )}  
                    className="flex flex-row justify-evenly items-end"
                >
                        <div className=' z-10 w-[6px] max-h-[30px] -rotate-90 origin-left whitespace-nowrap'>
                            {/* <div className='absolute -z-20 left-20 -bottom-24 rounded-e-lg -rotate-90 w-[30px] h-[170px] origin-left whitespace-nowrap bg-gray-600 p-2'>
                            </div> */}
                            {item.label}
                        </div>
                    <Image src={item.image} alt={item.label} className={`${index === selectedOption ? 'grayscale-0' : 'grayscale hover:grayscale-0'} z-10 object-cover min-w-[100px] min-h-[230px] rounded-2xl hover:translate-x-1 hover:translate-y-1 hover:border-2 hover:cursor-pointer transition-all`}/>
                </div>
            ))}
        </Div>
    </FormItem>
  )
}

export default CoverImg

CoverImg.propTypes = {
    userPromt: PropTypes.func,
  };