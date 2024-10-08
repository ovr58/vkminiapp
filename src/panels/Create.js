import { Button, Div, Image, Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { AgeSetting, CoverImg, StorySubjectInput, StoryType } from '../components';
import { useState } from 'react';
import { letsCreate } from '../assets';

export const Create = ({ id }) => {

  const routeNavigator = useRouteNavigator()

  const [promt, setPromt] = useState({
    storySubject: '',
    storyType: 'Приключения',
    ageSetting: '0-2 годика',
    coverImg: 'Загрузить'
  })

  const handleUserPromt = (data) => {
    const dataKey = Object.keys(data)[0]
    setPromt(prevPromt => ({
      ...prevPromt,
      [dataKey]: data[dataKey]
    }))
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
            transition-all'
            
        />
      </PanelHeader>
      <div key='settingsLayout' className='grid grid-cols-1 md:grid-cols-2 gap-10 mt-14'>
        <StorySubjectInput userPromt={handleUserPromt} />
        <StoryType userPromt={handleUserPromt} />
        <AgeSetting userPromt={handleUserPromt} />
        <CoverImg userPromt={handleUserPromt} />
      </div>
      <Div key='promt'>
        {promt.storyType}
        {promt.coverImg}
        {promt.storySubject}
        {promt.ageSetting}
      </Div>
    </Panel>
  );
};

Create.propTypes = {
  id: PropTypes.string.isRequired,
};
