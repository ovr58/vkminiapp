import { Image } from '@vkontakte/vkui';
import PropTypes from 'prop-types';

function BookCover({story}) {

    if (!story) return


  return (
    <Image src={story.imgUrl} />
  )
}

export default BookCover

BookCover.propTypes = {
    story: PropTypes.object
}