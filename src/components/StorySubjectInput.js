import { FormItem, Textarea } from "@vkontakte/vkui"
import PropTypes from 'prop-types';


function StorySubjectInput({userPromt}) {
  return (
    <FormItem top="Фабула истории">
        <label>Напишите краткое содержание Вашей истории... </label>
        <Textarea 
          placeholder="сказка про мальчика Ваню и Волшебную школу" 
          maxHeight={230} 
          onChange={(e) => userPromt({
            storySubject: e.target.value,
          })}
        />
    </FormItem>
  )
}

export default StorySubjectInput

StorySubjectInput.propTypes = {
    userPromt: PropTypes.func,
  };