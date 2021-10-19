import { clsx } from "@littlethings/css";
import Prose from "../../src/components/Prose";
import Surface from "../../src/components/Surface";
import useCSS from "../../src/hooks/useCSS";
import useTheme from "../../src/hooks/useTheme";

const Header = () => {
	const { util } = useTheme();

	const classes = useCSS(({ css, util }) => {
		const primary = util.color("primary");
		const secondary = util.color("secondary");

		return {
			root: css({
				display: "flex",
				flexDirection: "column",
				padding: `${util.space(8)}px ${util.space(4)}px`,
				backgroundImage: `linear-gradient(80deg, ${primary.main}, ${secondary.main})`,
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
