import { Div, Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { StorySubjectInput, StoryType } from '../components';

export const Create = ({ id }) => {
  const routeNavigator = useRouteNavigator()

  const handleUserPromt = (data) => {
    console.log(data)
  }

  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
        Написать сказку
      </PanelHeader>
      <Div className='grid grid-cols-1 md:grid-cols-2 gap-10 mt-14'>
        <StorySubjectInput userPromt={handleUserPromt} />
        <StoryType />
      </Div>
    </Panel>
  );
};

Create.propTypes = {
  id: PropTypes.string.isRequired,
};
