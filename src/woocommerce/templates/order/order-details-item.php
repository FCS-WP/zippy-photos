<?php

use Zippy_Addons\Utils\Zippy_DB_Helper;

if (! defined('ABSPATH')) {
	exit;
}

if (! apply_filters('woocommerce_order_item_visible', true, $item)) {
	return;
}
$order_type = $order->get_meta('_order_type', "");
$photo_detail = Zippy_DB_Helper::get_photo_data($order->get_id(), $item->get_product_id());
?>
<tr class="<?php echo esc_attr(apply_filters('woocommerce_order_item_class', 'woocommerce-table__line-item order_item', $item, $order)); ?>">
	<?php if ($photo_detail) : ?>
		<td class="woocommerce-table__product-name product-name">
			<div class="custom-box-checkout">
				<div class="image-box">
					<a href="<?php echo esc_url($photo_detail->photo_url) ?>">
						<img src="<?php echo esc_url($photo_detail->photo_url) ?>" alt="product-image">
					</a>
				</div>
				<strong>x <?php echo $item->get_quantity() ?></strong>
			</div>
		</td>
	<?php else: ?>
		<td class="woocommerce-table__product-name product-name">
			<?php
			$is_visible        = $product && $product->is_visible();
			$product_permalink = apply_filters('woocommerce_order_item_permalink', $is_visible ? $product->get_permalink($item) : '', $item, $order);

			echo wp_kses_post(apply_filters('woocommerce_order_item_name', $product_permalink ? sprintf('<a href="%s">%s</a>', $product_permalink, $item->get_name()) : $item->get_name(), $item, $is_visible));

			$qty          = $item->get_quantity();
			$refunded_qty = $order->get_qty_refunded_for_item($item_id);

			if ($refunded_qty) {
				$qty_display = '<del>' . esc_html($qty) . '</del> <ins>' . esc_html($qty - ($refunded_qty * -1)) . '</ins>';
			} else {
				$qty_display = esc_html($qty);
			}

			echo apply_filters('woocommerce_order_item_quantity_html', ' <strong class="product-quantity">' . sprintf('&times;&nbsp;%s', $qty_display) . '</strong>', $item); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

			do_action('woocommerce_order_item_meta_start', $item_id, $item, $order, false);

			wc_display_item_meta($item); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

			do_action('woocommerce_order_item_meta_end', $item_id, $item, $order, false);
			?>
		</td>
	<?php endif ?>
	<?php if ($order_type && $photo_detail): ?>
		<td class="woocommerce-table__product-table ">
			<div class="data-box">
				<p>
					Paper: <strong> <?php echo $photo_detail->paper_type ?></strong>
				</p>
				<p> Size:
					<strong>
						<?php
						echo wp_kses_post(apply_filters('woocommerce_order_item_name', $item->get_name(), $item, false));
						?>
					</strong>
				</p>
				<p>
					Photo: <a style="color: blue; text-decoration: underline;" href="<?php echo esc_url($photo_detail->photo_url) ?>">View</a> 
				</p>
			</div>
		</td>
	<?php else: ?>
		<td></td>
	<?php endif; ?>
	<td class="woocommerce-table__product-total product-total">
		<?php echo $order->get_formatted_line_subtotal($item); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped 
		?>
	</td>

</tr>

<?php if ($show_purchase_note && $purchase_note) : ?>

	<tr class="woocommerce-table__product-purchase-note product-purchase-note">

		<td colspan="2"><?php echo wpautop(do_shortcode(wp_kses_post($purchase_note))); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped 
						?></td>

	</tr>

<?php endif; ?>