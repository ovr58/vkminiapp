import { Div, Image, Panel, PanelHeader, PanelHeaderBack, ScreenSpinner, SplitCol, SplitLayout } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { AgeSetting, CoverImg, StorySubjectInput, StoryType } from '../components';
import { useState } from 'react';
import { letsCreate } from '../assets';
import { v4 as uuidv4 } from 'uuid'
import { chatSession, db, StoryData } from '../api';
import axios from 'axios';

const promtBP = import.meta.env.VITE_APP_STORY_PRMT

export const Create = ({ id, fetchedUser }) => {

  const routeNavigator = useRouteNavigator()

  const { id: userId, country } = { ...fetchedUser }

  console.log('USERID - ', userId)

  const [promt, setPromt] = useState({
    storySubject: '',
    storyType: 'Приключения',
    ageSetting: '0-2 годика',
    coverImg: 'Генерация'
  })

  const [popout, setPopout] = useState(null)

  const handleUserPromt = (data) => {
    const dataKey = Object.keys(data)[0]
    setPromt(prevPromt => ({
      ...prevPromt,
      [dataKey]: data[dataKey]
    }))
  }

  const generateStory = async () => {

    setPopout(<ScreenSpinner state="loading" size="large" caption="Долго сказка сказывается..." />)
    
    const storyTypeText = 
      promt.storyType === 'Приключенческая' ? 
      'герой встречает испытания и интересные события' :
      promt.storyType === 'Сказка на ночь' ?
      'много мистического и таинственного' :
      'герой узнает много об окружающем мире, науке и природе'

    const storySubject = promt.storySubject === '' ?
      'сказка про мальчика Ваню и Волшебную школу' :
      promt.storySubject

    const finalPromt = promtBP
      .replace('{ageSetting}', promt.ageSetting)
      .replace('{storyType}', promt.storyType)
      .replace('{storySubject}', storySubject)
      .replace('{storyTypeText}', storyTypeText)
    console.log(finalPromt)
    try {
      
      const result = await chatSession.sendMessage(finalPromt)
      const gemeniaiAnswer = JSON.parse(result.response.text())
      setPopout(<ScreenSpinner state="loading" size="large" caption="Лучше один раз увидеть..." />)
      console.log('GEMENI ANSWER - ', gemeniaiAnswer)
      const coverImgPrompt = `Generate an illustration that matches the prompt: ${gemeniaiAnswer.cover_prompt}`
      const generatedResponse  = await axios.post('https://imggenerateapi-38d36a8b3280.herokuapp.com/generate-image', { prompt: coverImgPrompt })
      
      console.log('RESPONSE - ', generatedResponse)

      const coverImgB64 = 'data:image/png;base64,' + generatedResponse.data.image
      setPopout(<ScreenSpinner state="loading" size="large" caption="Сохраню как все в кузовок..." />)
      const resp = await saveInDB(result.response.text(), coverImgB64)
      console.log('FROM - DB SAVE - ', resp)
      setPopout(null)
    } catch (error) {
      console.log(error)
      setPopout(null)
    }
    return
  }

  const saveInDB = async (output, coverImgB64) => {
    try {
      const result = await db.insert(StoryData).values({
        storyId: uuidv4(),
        ageGroup: promt.ageSetting,
        userId: userId,
        storySubject: promt.storySubject,
        storyType: promt.storyType,
        imageType: promt.coverImg,
        output: JSON.parse(output),
        coverImage: coverImgB64
      }).returning({storyId: StoryData.storyId})
      return result
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
        <Image 
          src={letsCreate}
          alt={'написать сказку'} 
          className='
            z-50 
            object-cover 
            min-w-[230px] 
            min-h-[50px]
            m-[5px] 
            rounded-2xl 
            hover:translate-x-1 
            hover:translate-y-1 
            hover:border-2 
            hover:cursor-pointer 
            transition-all
          '
          
          onClick = {!popout ? generateStory : undefined}
        />
      </PanelHeader>
      <SplitLayout key='settingsLayout' popout={popout} aria-live="polite" aria-busy={!!popout}>
        <SplitCol stretchedOnMobile>
          <StorySubjectInput userPromt={handleUserPromt} />
          <StoryType userPromt={handleUserPromt} />
        </SplitCol>
        <SplitCol stretchedOnMobile>
          <AgeSetting userPromt={handleUserPromt} />
          <CoverImg userPromt={handleUserPromt} />
        </SplitCol>
      </SplitLayout>
    </Panel>
  );
};

Create.propTypes = {
  id: PropTypes.string.isRequired,
  fetchedUser: PropTypes.shape({
    userId: PropTypes.number,
    country: PropTypes.shape({
      title: PropTypes.string,
    }),
  }),
};
