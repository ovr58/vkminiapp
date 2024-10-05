import { Div, FormItem, Image } from "@vkontakte/vkui"
import { adventurePic, badtimePic, educationalPic } from "../assets"

function StoryType() {

    const optionsList = [
        {
            label: 'Приключения',
            image: adventurePic,
            isFree: true
        },
        {
            label: 'На ночь',
            image: badtimePic,
            isFree: true
        },
        {
            label: 'Образовательная',
            image: educationalPic,
            isFree: true
        },
    ]
  return (
    <FormItem top="Жанр истории">
        <label>Сказки бывают разные. Какая будет эта?</label>
        <Div className='grid grid-cols-3'>
            {optionsList.map((item, index) => (
                <div key={`${index}_${item.label}`} className="flex flex-row justify-evenly items-end">
                    <h2 className='w-1/5 min-w-[100%] max-h-[30px] -rotate-90 origin-left whitespace-nowrap'>{item.label}</h2>
                    <Image src={item.image} alt={item.label} className='object-cover min-w-[100px] min-h-[230px] rounded-2xl'/>
                </div>
            ))}
        </Div>
    </FormItem>
  )
}

export default StoryType