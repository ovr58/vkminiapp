import { Div, Image, Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';
import { useParams, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { db, StoryData } from '../api';
import { eq } from 'drizzle-orm';
import { useCallback, useEffect, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { BookCover } from '../components';


export const ViewStory = ({ id, fetchedUser }) => {

  const routeNavigator = useRouteNavigator()

  const params = useParams()

  const [story, setStory] = useState()

  const getImgFromBase64 = (base64String) => {

    const byteString = atob(base64String.split(',')[1])
    const mimeString = base64String.split(',')[0].split(':')[1].split(';')[0]
    const byteArray = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++) {
      byteArray[i] = byteString.charCodeAt(i)
    }

    const blob = new Blob([byteArray], { type: mimeString })
    const url = URL.createObjectURL(blob)

    return url
  }

  const getStory = useCallback(async () => {

    const res = await db.select().from(StoryData).where(eq(StoryData.storyId, params.storyid))
    res[0].imgUrl = getImgFromBase64(res[0].coverImage)
    console.log('DB RES - ', res[0].imgUrl)
    setStory(res[0])
  }
  , [params])

  useEffect(() => {
    getStory()
  }, [getStory])

  const { id: userId, country } = { ...fetchedUser }

  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
      </PanelHeader>
      <Div key='viewStory'>
        <HTMLFlipBook width={300} height={400} size={"stretch"} minHeight={400} minWidth={300} maxHeight={1024} maxWidth={924}>
          <BookCover story={story} />
        </HTMLFlipBook>
      </Div>
    </Panel>
  );
};

ViewStory.propTypes = {
  id: PropTypes.string.isRequired,
  fetchedUser: PropTypes.shape({
    userId: PropTypes.number,
    country: PropTypes.shape({
      title: PropTypes.string,
    }),
  }),
  params: PropTypes.any
};