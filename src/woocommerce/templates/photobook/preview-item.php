<?php
$template_src = "https://drive.google.com/file/d/" . $item->get_meta('photobook_template_id') . "/preview";
$accepted = $item->get_meta('photobook_template_accepted', false);
?>
<div class="preview-item">
    <div class="preview-file"><iframe src="<?php echo $template_src ?>" width="640" height="480" allow="autoplay"></iframe></div>
    <div class="preview-info">
        <h5><?php echo $product_name ?></h5>
        <p>Model: <strong><?php echo $item->get_meta('model') ?></strong> </p>
        <p>Template version: <strong>#<?php echo $item->get_meta('template_version') ?></strong> </p>
        <?php if ($accepted) : ?>
            <div class="status" data-item_id="<?php echo $item->get_id() ?>">
                <span class="accepted">✅ Accepted</span>
            </div>
        <?php else: ?>
            <div class="preview-btns" data-item_id="<?php echo $item->get_id() ?>" data-order_id="<?php echo $order->id ?>" data-template_src="<?php echo $template_src ?>">
                <button class="p-btn-secondary update-btn">Need to update</button>
                <button class="p-btn-primary accept-btn">Accept this version</button>
            </div>
        <?php endif; ?>
        <div class="contact-via-whatsapp" style="margin-top: 20px;">
            <h6 style="margin-bottom: 10px;">*Need to contact us? Chat with us below.</h6>
            <a href="https://wa.me/+6596959753" target="_blank" type="button" class="whatsapp-btn">
                <img width="25px" src="<?php echo plugin_dir_url('zippy-photos/assets/icons/whatsapp.svg') . 'whatsapp.svg' ?>" alt="whatsapp:">
                Whatsapp
            </a>
        </div>
    </div>
</div>