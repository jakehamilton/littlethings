import { clsx } from "@littlethings/css";
import { Moon, Sun } from "preact-feather";
import { useEffect } from "preact/hooks";
import FilledButton from "../../src/components/Button/FilledButton";
import ButtonBase from "../../src/components/ButtonBase";
import Prose from "../../src/components/Prose";
import Surface from "../../src/components/Surface";
import useCSS from "../../src/hooks/useCSS";
import useTheme from "../../src/hooks/useTheme";

const Header = () => {
	const { mode, setMode } = useTheme();

	const handleToggleMode = () => {
		setMode(mode === "light" ? "dark" : "light");
	};

	const classes = useCSS("Header", ({ css, util }) => {
		const primary = util.color("primary");
		const secondary = util.color("secondary");

		return {
			root: css({
				display: "flex",
				flexDirection: "column",
				padding: `${util.space(8)}px ${util.space(4)}px`,
				backgroundImage: `linear-gradient(80deg, ${primary.main}, ${secondary.main})`,
			}),
			toggle: css({
				position: "absolute",
				justifyContent: "center",
				top: `${util.space(2)}px`,
				right: `${util.space(2)}px`,
				width: `${util.space(8)}px`,
				height: `${util.space(8)}px`,
				borderRadius: `${util.round("lg")}px`,
			}),
			title: css({
				fontSize: "4.25rem",
				lineHeight: "1",
			}),
			text: css({
				color: primary.text,
			}),
		};
	});

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
