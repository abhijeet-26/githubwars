import {useEffect, useRef, useState} from 'react';
import {Button, Form, InputGroup, Alert} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {FaGithub} from 'react-icons/fa';
import {useUser} from '../Contexts/UserProvider';
import ThemeBtn from './ThemeBtn';
import useLocalStorage from 'use-local-storage';

export default function Game2() {
	const [user1, setUser1] = useState('');
	const [user2, setUser2] = useState('');
	const [error, setError] = useState('');
	const [hideInput, setHideInput] = useState(false);
	const usernameRef = useRef();
	const navigate = useNavigate();
	const {users} = useUser();
	const preferDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	const [theme, setTheme] = useLocalStorage('theme', preferDark ? 'dark' : 'light');
	const headers = {
		authorization: `${process.env.REACT_APP_PAT}`,
	};

	const getRandomUser = async () => {
		const randomIndex = Math.floor(Math.random() * users.length);

		const res = await fetch(
			`https://api.github.com/users/${users[randomIndex]}`,
			{
				method: 'GET',
				headers: headers,
			}
		);
		const data = await res.json();
		setUser2(data);
	};

	const fetchUser = () => {
		fetch(`https://api.github.com/users/${usernameRef.current.value}`, {
			method: 'GET',
			headers: headers,
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.message === undefined) {
					setError('');
					setUser1(data);
					setHideInput(true);
				} else {
					setError('Invalid Username!');
				}
			});
	};

	const battle = () => {
		navigate('/stats', {state: {user1, user2}});
	};

	const toggleTheme = () => {
		if (theme === 'dark') {
			setTheme('light');
		} else {
			setTheme('dark');
		}
	};

	useEffect(() => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

	return (
		<>
			<div className='bg' data-theme={theme}>
				<img
					className='animated-icon'
					src='https://user-images.githubusercontent.com/55504616/217468363-e2c929f6-424c-4186-95fe-ab37f07c4d56.svg'
					alt='octocat-animation'
				/>
				<div className='arena'>
					<div className='user1'>
						{user1 !== '' && (
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}>
								<img src={user1.avatar_url} className='avatar' alt='player1' />
								<h1>{user1.name}</h1>
								<p style={{fontSize: '20px', textAlign: 'center'}}>
									{user1.bio}
								</p>
							</div>
						)}
						{error !== '' && hideInput !== true && (
							<Alert variant='danger'>{error}</Alert>
						)}
						<InputGroup hidden={hideInput}>
							<Form.Control
								ref={usernameRef}
								placeholder='Enter 1st GitHub Username'
								style={{background: 'transparent'}}
							/>
							<Button className='btn' onClick={() => fetchUser()}>
								Get
							</Button>
						</InputGroup>
					</div>
					<Button
						className='btn'
						disabled={!hideInput || user2 === ''}
						onClick={() => battle()}>
						Battle
					</Button>
					<div className='user2'>
						{hideInput === false && (
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
								}}>
								<img
									src='https://user-images.githubusercontent.com/55504616/217468609-0d6531b4-9251-47c2-919a-7d5f79b9df8a.gif'
									width='100px'
									height='100px'
									alt='loading-gif'
								/>
								<p
									style={{
										color: 'var(--theme)',
										fontSize: '15px',
										textAlign: 'center',
									}}>
									Waiting for first player . . .
								</p>
							</div>
						)}
						{hideInput === true && (
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
								}}>
								{user2 !== '' && (
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											justifyContent: 'space-between',
											alignItems: 'center',
										}}>
										<img
											src={user2.avatar_url}
											className='avatar'
											alt='player2'
										/>
										<h1>{user2.name}</h1>
										<p style={{fontSize: '20px', textAlign: 'center'}}>
											{user2.bio}
										</p>
									</div>
								)}
								<Button className='btn' onClick={() => getRandomUser()}>
									Fetch Random User
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
			<footer style={{textAlign: 'center'}} data-theme={theme}>
				<a
					href='https://github.com/Ananya2001-an/githubwars'
					target='_blank'
					style={{color: 'black', fontSize: '20px', cursor: 'pointer'}}
					rel='noreferrer'>
					<FaGithub />
				</a>
				<ThemeBtn onChange={toggleTheme} />
			</footer>{' '}
		</>
	);
}
