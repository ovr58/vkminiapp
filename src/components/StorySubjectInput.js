import { FormItem, Textarea } from "@vkontakte/vkui"
import PropTypes from 'prop-types';


function StorySubjectInput({userPromt}) {
  return (
    <FormItem top="Фабула истории">
        <label>Напишите краткое содержание Вашей истории... </label>
        <Textarea placeholder="Шаблон:  " maxHeight={230} onChange={(e) => userPromt({
            fieldValue: e.target.value,
            fieldName: 'storySubject'
        })}/>
    </FormItem>
  )
}

export default StorySubjectInput

StorySubjectInput.propTypes = {
    userPromt: PropTypes.shape({
      fieldValue: PropTypes.string,
      fieldName: PropTypes.string,
    }),
  };