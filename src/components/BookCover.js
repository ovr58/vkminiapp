import { Image } from '@vkontakte/vkui';
import PropTypes from 'prop-types';

function BookCover({story}) {

  return (
    <Image src={story.imgUrl} style={{width: 'auto', height: 'auto', padding: '5px', marginRight: '10px'}} />
  )
}

export default BookCover

BookCover.propTypes = {
    story: PropTypes.object
}