<?php

add_action('woocommerce_admin_order_item_headers', 'custom_order_item_headers', 100);

function custom_order_item_headers()
{
    echo '<th class="paper-type">Customer Photo</th>';
    echo '<th class="custom-action">Custom Action</th>';
}

add_action('woocommerce_admin_order_item_values', 'custom_order_item_values', 100, 3);

function custom_order_item_values($product, $item, $item_id)
{
    // Render Image Photo Editor Item: 
    $photo_url = $item->get_meta('photo_url');
    $folder_id = $item->get_meta('Photobook Folder ID');

    echo '<td class="paper-type">';

    if ($photo_url) {
        echo '<div class="custom-img-col"><a target="_blank" href="' . esc_url($photo_url) . '"><img class="ordered-img" src="' . esc_url($photo_url) . '" alt="ordered-img"/></a></div>';
    } else {
        echo '-';
    }

    //  Render Action Upload PDF 
    echo '<td class="custom-action">';
    if ($folder_id) {
        echo render_custom_upload_button($item, $item_id, $folder_id);
    } else {
        echo '-';
    }

    echo '</td>';
}

function render_custom_upload_button($item, $item_id, $folder_id)
{
    $accepted = $item->get_meta('photobook_template_accepted', 0);
    ob_start();
?>
    <div class="upload-pdf-wrapper" data-item-id="<?php echo esc_attr($item_id); ?>" data-folder-id="<?php echo esc_attr($folder_id); ?>">
        <?php if ($accepted) : ?>
            <span>✅ Client Accepted</span>
        <?php else: ?>
            <input type="file" class="custom-upload-input" accept="application/pdf" style="display:none;" />
            <button type="button" class="button custom-upload-btn">Upload Template PDF</button>
        <?php endif ?>
    </div>
<?php
    return ob_get_clean();
}
