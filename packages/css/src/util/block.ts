const block = <Selector extends string, Body extends string>(
	selector: Selector,
	body: Body
): `${Selector}{${Body}}` => {
	return `${selector}{${body}}`;
};

export default block;
