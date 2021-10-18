import useCSS from "../../src/hooks/useCSS";
import Prose from "../../src/components/Prose";
import Gap from "../../src/components/Gap";
import Surface from "../../src/components/Surface";

const Surfaces = () => {
	const classes = useCSS(({ css, util }) => {
		return {
			root: css`
				display: flex;
				flex-direction: column;
				padding: ${util.space(4)}px;
			`,
			example: css`
				display: flex;
				flex-wrap: wrap;
				gap: ${util.space(1)}px;
			`,
			surface: css`
				width: ${util.space(8)}px;
				height: ${util.space(8)}px;
				border-radius: ${util.round("md")}px;
			`,
		};
	});

	return (
		<div class={classes.root}>
			<Prose as="h2" size="xl">
				Surfaces
			</Prose>
			<Prose size="md" variant="secondary">
				Surfaces are an easy way to group content and add shadows.
			</Prose>
			<Gap vertical size={2} />
			<div class={classes.example}>
				<Surface elevation="xs" classes={{ root: classes.surface }} />
				<Surface elevation="sm" classes={{ root: classes.surface }} />
				<Surface elevation="md" classes={{ root: classes.surface }} />
				<Surface elevation="lg" classes={{ root: classes.surface }} />
				<Surface elevation="xl" classes={{ root: classes.surface }} />
			</div>
			<Gap vertical size={2} />
			<div class={classes.example}>
				<Surface
					elevation="xs"
					color="primary"
					classes={{ root: classes.surface }}
				/>
				<Surface
					elevation="sm"
					color="primary"
					classes={{ root: classes.surface }}
				/>
				<Surface
					elevation="md"
					color="primary"
					classes={{ root: classes.surface }}
				/>
				<Surface
					elevation="lg"
					color="primary"
					classes={{ root: classes.surface }}
				/>
				<Surface
					elevation="xl"
					color="primary"
					classes={{ root: classes.surface }}
				/>
			</div>
			<Gap vertical size={2} />
			<div class={classes.example}>
				<Surface
					elevation="xs"
					color="secondary"
					classes={{ root: classes.surface }}
				/>
				<Surface
					elevation="sm"
					color="secondary"
					classes={{ root: classes.surface }}
				/>
				<Surface
					elevation="md"
					color="secondary"
					classes={{ root: classes.surface }}
				/>
				<Surface
					elevation="lg"
					color="secondary"
					classes={{ root: classes.surface }}
				/>
				<Surface
					elevation="xl"
					color="secondary"
					classes={{ root: classes.surface }}
				/>
			</div>
		</div>
	);
};

export default Surfaces;
