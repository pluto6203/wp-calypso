/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { localize } from 'i18n-calypso';
import { isUndefined } from 'lodash';

/**
 * Internal dependencies
 */
import PopoverMenu from 'components/popover/menu';
import PopoverMenuItem from 'components/popover/menu-item';
import Gridicon from 'components/gridicon';
import Count from 'components/count';

class TaxonomyManagerListItem extends Component {
	static propTypes = {
		name: PropTypes.string,
		postCount: PropTypes.number,
		translate: PropTypes.func,
		onClick: PropTypes.func,
		onDelete: PropTypes.func,
		isDefault: PropTypes.bool,
		siteUrl: PropTypes.string,
		slug: PropTypes.string,
	};

	static defaultProps = {
		isDefault: false,
		onClick: () => {},
	};

	constructor( props ) {
		super( props );
		this.state = {
			popoverMenuOpen: false
		};
	}

	togglePopoverMenu = event => {
		event.stopPropagation && event.stopPropagation();
		this.setState( {
			popoverMenuOpen: ! this.state.popoverMenuOpen
		} );
	};

	editItem = () => {
		this.setState( {
			popoverMenuOpen: false
		} );
		this.props.onClick();
	};

	deleteItem = () => {
		this.setState( {
			popoverMenuOpen: false
		} );
		this.props.onDelete();
	};

	getTaxonomyLink() {
		const { taxonomy, siteUrl, slug } = this.props;
		let taxonomyBase = taxonomy;

		if ( taxonomy === 'post_tag' ) {
			taxonomyBase = 'tag';
		}
		return `${ siteUrl }/${ taxonomyBase }/${ slug }/`;
	}

	render() {
		const { isDefault, onDelete, postCount, name, translate } = this.props;
		const className = classNames( 'taxonomy-manager__item', {
			'is-default': isDefault
		} );

		return (
			<div className={ className }>
				<span className="taxonomy-manager__icon">
					<Gridicon icon={ isDefault ? 'checkmark-circle' : 'folder' } />
				</span>
				<span className="taxonomy-manager__label">
					<span>{ name }</span>
					{ isDefault &&
						<span className="taxonomy-manager__default-label">
							{ translate( 'default', { context: 'label for terms marked as default' } ) }
						</span>
					}
				</span>
				{ ! isUndefined( postCount ) && <Count count={ postCount } /> }
				<span
					className="taxonomy-manager__action-wrapper"
					onClick={ this.togglePopoverMenu }
					ref="popoverMenuButton">
					<Gridicon
						icon="ellipsis"
						className={ classNames( {
							'taxonomy-manager__list-item-toggle': true,
							'is-active': this.state.popoverMenuOpen
						} ) } />
				</span>
				<PopoverMenu
					isVisible={ this.state.popoverMenuOpen }
					onClose={ this.togglePopoverMenu }
					position={ 'bottom left' }
					context={ this.refs && this.refs.popoverMenuButton }
				>
					<PopoverMenuItem onClick={ this.editItem } icon="pencil">
						{ translate( 'Edit' ) }
					</PopoverMenuItem>
					{ onDelete &&
						<PopoverMenuItem onClick={ this.deleteItem } icon="trash">
							{ translate( 'Delete' ) }
						</PopoverMenuItem>
					}
					<PopoverMenuItem href={ this.getTaxonomyLink() } icon="external">
						{ translate( 'View Posts' ) }
					</PopoverMenuItem>
				</PopoverMenu>
			</div>
		);
	}
}

export default localize( TaxonomyManagerListItem );
