import { Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar, Image, SplitLayout, SplitCol, Text, EllipsisText } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { fairytails, logo } from '../assets';

export const Home = ({ id, fetchedUser }) => {
  const { photo_200, city, first_name, last_name } = { ...fetchedUser };
  const routeNavigator = useRouteNavigator();

  return (
    <Panel id={id}>
      <PanelHeader>
        <div style={{display: 'flex', width: 'full', justifyContent: 'flex-start', alignItems: 'center'}}>
          <Image src={logo} alt={"подари ребенку сказку"}  style={{padding: '5px', marginRight: '10px'}}/>
          Подари ребенку сказку
        </div>
      </PanelHeader>
      {/* {fetchedUser && (
        <Group header={<Header mode="secondary">Ох уж эти сказочники...</Header>}>
          <Cell before={photo_200 && <Avatar src={photo_200} />} subtitle={city?.title}>
            {`${first_name} ${last_name}`}
          </Cell>
        </Group>
      )} */}

      <Group>
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
      <SplitLayout center style={{display: 'flex', alignItems: 'center'}}>
        <SplitCol width="100%" maxWidth="560px" autoSpaced>
          <Image src={fairytails} alt={"сказочный VK"}  style={{width: 'auto', height: 'auto', padding: '5px', marginRight: '10px'}}/>
        </SplitCol>
        <SplitCol autoSpaced>
          <div key='firstTextMain' style={{marginBottom: '15px', fontFamily: 'sans-serif', fontSize: '24px', textAlign: 'center', textUnderlineOffset: '20px' }}>
            Создай магический подарок - книжку-сказку за минуту!
          </div>
          <div key='secondTextMain' style={{marginBottom: '15px', fontFamily: 'sans-serif', fontSize: '18px', textAlign: 'center', textUnderlineOffset: '20px' }}>
            За секунды создайте приключения с Вашим чадом в главной роли! Это подстегнет его страсть к чтению и заложит основы разносторонней личности!
          </div>
          <Button key='secondMenu1' stretched size="1" mode="primary" onClick={() => routeNavigator.push('create')}>
            Начать!
          </Button>
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
