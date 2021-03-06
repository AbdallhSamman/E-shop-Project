/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { ShippingRatesControl } from '@woocommerce/base-components/cart-checkout';
import { getShippingRatesPackageCount } from '@woocommerce/base-utils';
import { getCurrencyFromPriceResponse } from '@woocommerce/price-format';
import FormattedMonetaryAmount from '@woocommerce/base-components/formatted-monetary-amount';
import {
	useEditorContext,
	useShippingDataContext,
} from '@woocommerce/base-context';
import { decodeEntities } from '@wordpress/html-entities';
import { Notice } from 'wordpress-components';
import classnames from 'classnames';
import { getSetting } from '@woocommerce/settings';
import type { PackageRateOption } from '@woocommerce/type-defs/shipping';
import type { CartShippingPackageShippingRate } from '@woocommerce/type-defs/cart';

/**
 * Internal dependencies
 */
import NoShippingPlaceholder from './no-shipping-placeholder';

/**
 * Renders a shipping rate control option.
 *
 * @param {Object} option Shipping Rate.
 */
const renderShippingRatesControlOption = (
	option: CartShippingPackageShippingRate
): PackageRateOption => {
	const priceWithTaxes = getSetting( 'displayCartPricesIncludingTax', false )
		? parseInt( option.price, 10 ) + parseInt( option.taxes, 10 )
		: parseInt( option.price, 10 );
	return {
		label: decodeEntities( option.name ),
		value: option.rate_id,
		description: decodeEntities( option.description ),
		secondaryLabel: (
			<FormattedMonetaryAmount
				currency={ getCurrencyFromPriceResponse( option ) }
				value={ priceWithTaxes }
			/>
		),
		secondaryDescription: decodeEntities( option.delivery_time ),
	};
};

const Block = (): JSX.Element | null => {
	const { isEditor } = useEditorContext();
	const {
		shippingRates,
		shippingRatesLoading,
		needsShipping,
		hasCalculatedShipping,
	} = useShippingDataContext();

	if ( ! needsShipping ) {
		return null;
	}

	return (
		<>
			{ isEditor && ! getShippingRatesPackageCount( shippingRates ) ? (
				<NoShippingPlaceholder />
			) : (
				<ShippingRatesControl
					noResultsMessage={
						hasCalculatedShipping ? (
							<Notice
								isDismissible={ false }
								className={ classnames(
									'wc-block-components-shipping-rates-control__no-results-notice',
									'woocommerce-error'
								) }
							>
								{ __(
									'There are no shipping options available. Please ensure that your address has been entered correctly, or contact us if you need any help.',
									'woo-gutenberg-products-block'
								) }
							</Notice>
						) : (
							__(
								'Shipping options will appear here after entering your full shipping address.',
								'woo-gutenberg-products-block'
							)
						)
					}
					renderOption={ renderShippingRatesControlOption }
					shippingRates={ shippingRates }
					shippingRatesLoading={ shippingRatesLoading }
				/>
			) }
		</>
	);
};

export default Block;
