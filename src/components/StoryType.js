import { Div, FormItem, Image } from "@vkontakte/vkui"
import { adventurePic, badtimePic, educationalPic } from "../assets"
import { useState } from "react"
import PropTypes from 'prop-types';

function StoryType({userPromt}) {

    const optionsList = [
        {
            label: 'Приключенческая',
            image: adventurePic,
            isFree: true
        },
        {
            label: 'Сказка на ночь',
            image: badtimePic,
            isFree: true
        },
        {
            label: 'Образовательная',
            image: educationalPic,
            isFree: true
        },
    ]

    const [selectedOption, setSelectedOption] = useState(0)
  return (
    <FormItem top="Жанр истории">
        <label>Сказки бывают разные. Какая будет эта?</label>
        <Div className='grid grid-cols-3'>
            {optionsList.map((item, index) => (
                <div 
                    key={`${index}_${item.label}`} 
                    onClick={() => (
                        setSelectedOption(index),
                        userPromt({
                            storyType: item.label
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

export default StoryType

StoryType.propTypes = {
    userPromt: PropTypes.func,
  };