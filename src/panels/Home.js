import { Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar, Image, SplitLayout, SplitCol } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { logo } from '../assets';

export const Home = ({ id, fetchedUser }) => {
  const { photo_200, city, first_name, last_name } = { ...fetchedUser };
  const routeNavigator = useRouteNavigator();

  return (
    <Panel id={id}>
      <PanelHeader>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Image src={logo} alt={"подари ребенку сказку"}  style={{padding: '5px', marginRight: '10px'}}/>
          Подари ребенку сказку
        </div>
      </PanelHeader>
      {fetchedUser && (
        <Group header={<Header mode="secondary">Ох уж эти сказочники...</Header>}>
          <Cell before={photo_200 && <Avatar src={photo_200} />} subtitle={city?.title}>
            {`${first_name} ${last_name}`}
          </Cell>
        </Group>
      )}

      <Group header={<Header mode="primary">Ты сегодня Андерсен?</Header>}>
        <Div style={{display: 'flex', gap: '15px', justifyContent: 'space-evenly'}}>
          <Button key='mainMenu1' stretched size="1" mode="primary" onClick={() => routeNavigator.push('create')}>
            Напиши сказку!
          </Button>
          <Button key='mainMenu2' stretched size="l" mode="primary" onClick={() => routeNavigator.push('explore')}>
            Сказки Вконтакта!
          </Button>
          <Button key='mainMenu3' stretched size="l" mode="primary" onClick={() => routeNavigator.push('contact')}>
            Связаться
          </Button>
        </Div>
      </Group>
      <SplitLayout>
        <SplitCol>
          
        </SplitCol>
        <SplitCol>
          вторая
        </SplitCol>
      </SplitLayout>
    </Panel>
  );
};

Home.propTypes = {
  id: PropTypes.string.isRequired,
  fetchedUser: PropTypes.shape({
    photo_200: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    city: PropTypes.shape({
      title: PropTypes.string,
    }),
  }),
};
