import { clsx } from "@littlethings/css";
import { Moon, Sun } from "preact-feather";
import { useEffect } from "preact/hooks";
import FilledButton from "../../src/components/Button/FilledButton";
import ButtonBase from "../../src/components/ButtonBase";
import Prose from "../../src/components/Prose";
import Surface from "../../src/components/Surface";
import useTheme from "../../src/hooks/useTheme";
import { style } from "../../src/theme/style";

const { useStyles } = style((theme) => {
	const primaryColor = theme.color("primary.text");
	const primaryBackground = theme.color("primary.main");
	const secondaryBackground = theme.color("secondary.main");

	return {
		root: {
			display: "flex",
			flexDirection: "column",
			padding: `${theme.space(8)}px ${theme.space(4)}px`,
			backgroundImage: `linear-gradient(80deg, ${primaryBackground}, ${secondaryBackground})`,
		},
		toggle: {
			position: "absolute",
			justifyContent: "center",
			top: `${theme.space(2)}px`,
			right: `${theme.space(2)}px`,
			width: `${theme.space(8)}px`,
			height: `${theme.space(8)}px`,
			borderRadius: `${theme.round("lg")}px`,
		},
		title: {
			fontSize: "4.25rem",
			lineHeight: "1",
		},
		text: {
			color: primaryColor,
		},
	};
});

const Header = () => {
	const { mode, setMode } = useTheme();

	const handleToggleMode = () => {
		setMode(mode === "light" ? "dark" : "light");
	};

	const classes = useStyles();

	return (
		<Surface classes={{ root: classes.root }}>
			<FilledButton
				float
				color="background.light"
				classes={{ root: classes.toggle }}
				onClick={handleToggleMode}
			>
				{mode === "light" ? <Sun /> : <Moon />}
			</FilledButton>
			<Prose
				size="xl"
				font="secondary"
				classes={{ root: clsx(classes.title, classes.text) }}
			>
				Little UI
			</Prose>
			<Prose
				size="md"
				variant="secondary"
				classes={{
					root: classes.text,
				}}
			>
				A full-featured, Preact-based UI library.
			</Prose>
		</Surface>
	);
};

export default Header;
