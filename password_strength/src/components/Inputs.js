import React, { useState, Fragment } from 'react';
import Input from '@vkontakte/vkui/dist/components/Input/Input';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import bridge from '@vkontakte/vk-bridge';
import PromoBanner from '@vkontakte/vkui/dist/components/PromoBanner/PromoBanner';
import CardGrid from '@vkontakte/vkui/dist/components/CardGrid/CardGrid';
import Card from '@vkontakte/vkui/dist/components/Card/Card';

import zxcvbn from 'zxcvbn';
import { platform, IOS, ANDROID, Counter } from '@vkontakte/vkui';

import bgImg from '../img/bg.jpg';

const osName = platform();

const Strings = {
	seconds: 'секунд',
	second: 'секунда',
    minutes: 'минут',
    minute: 'минута',
    hours: 'часов',
    hous: 'час',
    days: 'дней',
    day: 'день',
    months: 'месяцев',
    month: 'месяц',
    years: 'лет',
    year: 'год',
	centuries: 'века',
	less: 'мгновенно'
};

const Inputs = () => {

	const [snackbar, setSnackbar] = useState(null);
	const [length, setLength] = useState("0");
	const [crackTimeCouner, setCrackTimeCouner] = useState('мгновенно');
	const [ads, setAds] = useState(null);
	const [closedAds, setClosedAds] = useState(false);

	const onPasswordInput = e => {
		set_CrackTimeCounter(e.target.value);
		setCrackTimeIndicator(e.target.value);
		setLength(e.target.value.length);
		if (e.target.value === "") {
			clearIndicatorClasses();
		}
	}

	const set_CrackTimeCounter = password => {
		const crackTime = zxcvbn(password).crack_times_display.online_no_throttling_10_per_second.split(" ");
            // centuries ?
            if (crackTime.length < 2) {
                setCrackTimeCouner(`${Strings[crackTime[0]]}`);
            } else if (crackTime.length > 3) {
                setCrackTimeCouner(`${Strings[crackTime[0]]}`);
            } else {
				setCrackTimeCouner(`${parseInt(crackTime[0])} ${Strings[crackTime[1]]}`);
			}
	}

	const setCrackTimeIndicator = password => {
		const indicatorBoxes = document.querySelectorAll(".indicator_box");
		// clear classes
		clearIndicatorClasses();
		const passwordScore = zxcvbn(password).score;
		switch (passwordScore) {
			case 0:
			case 1:
				indicatorBoxes[0].classList.add("red_indicator_box");
				break;
			case 2:
				for (let i = 0; i < 2; i++) {
					indicatorBoxes[i].classList.add("orange_indicator_box");
				}
				break;
			case 3:
				for (let i = 0; i < 3; i++) {
					indicatorBoxes[i].classList.add("green_indicator_box");
				}
				break;
			case 4:
				for (let i = 0; i < 4; i++) {
					indicatorBoxes[i].classList.add("green_indicator_box");
				}
				break;
		}
	}

	const clearIndicatorClasses = () => {
		const indicatorBoxes = document.querySelectorAll(".indicator_box");
		indicatorBoxes.forEach(box => {
			// get all classes of current box
			let classes = box.classList;
			classes.forEach(currentClass => {
				// not base indicator class ?
				if (currentClass !== "indicator_box") {
					// remove class
					classes.remove(currentClass);
				}
			})
		});
	}

	const onCloseAds = () => {
		setAds(null);
		setClosedAds(true);
	}

	const getAds = async () => {
		const adv = await bridge.send("VKWebAppGetAds", {});
		setAds(adv);
	}

	if (!ads && !closedAds && (osName === IOS || osName === ANDROID)) {
		getAds();
	}

	return (
		<Fragment>
			<CardGrid>
				<Card size='l' mode="shadow">
					<FormLayout>
						<Input
							className="password_input"
							top={ <Header className='prompt'>Введите Ваш пароль:</Header> }
							onChange={e => onPasswordInput(e)}
							maxLength={99}
						/>
					</FormLayout>
				</Card>
				<Card size='l' mode="shadow">
					<Div className='length_card'>
						<Header className='prompt'>Длина Вашего пароля:</Header>
						<Counter mode='primary' className='length_value'>{length}</Counter>
					</Div>
				</Card>
				<Card size="l" mode="shadow">
					<img src={bgImg} alt='Strength' className='bg_img' />
					<Div className='prompt'>Безопасность Вашего пароля:</Div>
					<div className='strength_indicator'>
						<div className="indicator_box"></div>
						<div className="indicator_box"></div>
						<div className="indicator_box"></div>
						<div className="indicator_box"></div>
					</div>
					<Div className='prompt crack_time_prompt'>Ориентировочное время злома</Div>
					<Div className='value crack_time_value'><span className='main_value'>{crackTimeCouner}</span></Div>
				</Card>
			</CardGrid>
			{ ads && <PromoBanner className='promo' bannerData={ ads }  onClose={() => onCloseAds()}/> }
			{snackbar}
		</Fragment>
	);
};

export default Inputs;