import React from 'react';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Inputs from '../components/Inputs';

import './Home.css';

const Home = () => {

	return (
		<Panel id="0">
			<PanelHeader>Надежность пароля</PanelHeader>
			<Inputs />
		</Panel>
	);
};

export default Home;