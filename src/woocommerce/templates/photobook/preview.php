<?php

/**
 * Template Name: Photobook Preview
 */

use Zippy_Addons\Src\Helpers\Zippy_Request_Helper;

$order_id = $_GET['order_id'];
$order = $order_id ? wc_get_order($order_id) : '';
$order_key = $order ? Zippy_Request_Helper::get_wc_order_key($order->get_order_key()) : '';
$customer_order_key = $_POST['customer_order_key'];

if ($customer_order_key) {
    $error_message = $customer_order_key == $order_key ? '' : 'Invalid key. Please try again!';
}

get_header(); ?>

<!-- Your preview HTML content -->

<?php
if (!$order_id) {
    echo '<div><h2 class="text-center">Photobook preview not found!</h2></div>';
    return;
} else if (!$order) {
    echo '<div><h2 class="text-center">Order not found!</h2></div>';
    return;
}
?>

<div class="preview-container">
    <?php if (!$customer_order_key || $error_message) :?>
        <h5 class="error-message"><?php echo $error_message ?? "" ?></h5>
        <div >
            <form class="authentication-form" method="POST" name="authentication-form" action="">
                <div>
                    <input type="text" name="customer_order_key" placeholder="Enter secret key to preview">
                    <input type="hidden" name="order_id" value="<?php echo $order_id ?>">
                    <button class="text-end" type="submit">Submit</button>
                </div>
            </form>
        </div>
    <?php else: ?>
        <?php 
            foreach ( $order->get_items() as $item_id => $item ) {
                if (!$item->get_meta('photobook_template_id')) {
                    continue;
                }
                $product = $item->get_product();
     
                $product_name = $item->get_name();
                $product_id = $item->get_product_id();
                $variation_id = $item->get_variation_id();

                include  plugin_dir_path(__FILE__). '/preview-item.php';
            }
        ?>
    <?php endif ?>
</div>

<?php get_footer(); ?>