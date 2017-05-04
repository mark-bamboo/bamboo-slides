<?php
/**************************************************************************************************/
/*
Plugin Name: Bamboo Slides
Plugin URI:  https://www.bamboomanchester.uk/wordpress/bamboo-slides
Author:      Bamboo
Author URI:	 https://www.bamboomanchester.uk
Version:     1.9.8
Description: With three different animation styles, Bamboo Slides allows you to incorporate a cool looking interactive banner or slideshow into any page – no coding or Flash required.
*/

/************************************************************************************************************/

	if ( ! defined( 'ABSPATH' ) ) {
		exit;
	}

/************************************************************************************************************/

	add_action( 'init', 'bamboo_slides_create_post_type' );
	function bamboo_slides_create_post_type() {

		// REGISTER BAMBOO_SLIDE POST TYPE
		register_post_type( 'bamboo_slide',
			array(
				'labels'	=> array(
					'name' 			=> __( 'Bamboo Slide', 	'bamboo' ),
					'singular_name'	=> __( 'Slide', 			'bamboo' ),
					'menu_name' 	=> __( 'Bamboo Slides', 'bamboo' ),
					'all_items' 	=> __( 'All Slides', 	'bamboo' ),
					'add_new_item' 	=> __( 'Add New Slide',	'bamboo' ),
					'edit_item' 	=> __( 'Edit Slide', 	'bamboo' ),
					'new_item' 		=> __( 'New Slide', 		'bamboo' ),
					'view_item' 	=> __( 'View Slide', 	'bamboo' ),
					'search_items' 	=> __( 'Search Slides', 	'bamboo' )
				),
				'public' 			  	=> true,
				'has_archive'	 	  	=> true,
				'exclude_from_search' 	=> true,
				'show_in_nav_menus'   	=> false,
				'menu_position'			=> 20,
				'supports' 			  	=> array ( 'title', 'editor', 'tags', 'thumbnail')
			)
		);

		// REGISTER BAMBOO_SLIDE_GROUP TAXONOMY
		register_taxonomy( 'bamboo_slide_group', 'bamboo_slide',
			array(
				'hierarchical'	=> true,
				'labels'			=> array(
					'name'                       	=> _x( 'Slide Group', 'taxonomy general name' ),
					'singular_name'              	=> _x( 'Slide Group', 'taxonomy singular name' ),
					'search_items'               	=> __( 'Search Slide Groups' ),
					'popular_items'              	=> __( 'Popular Slide Groups' ),
					'all_items'                  	=> __( 'All Slide Groups' ),
					'parent_item'                	=> null,
					'parent_item_colon'          	=> null,
					'edit_item'                  	=> __( 'Edit Slide Group' ),
					'update_item'                	=> __( 'Update Slide Group' ),
					'add_new_item'              	=> __( 'Add New Slide Group' ),
					'new_item_name'              	=> __( 'New Slide Group Name' ),
					'separate_items_with_commas'	=> __( 'Separate slide groups with commas' ),
					'add_or_remove_items'        	=> __( 'Add or remove slide groups' ),
					'choose_from_most_used'      	=> __( 'Choose from the most used slide groups' ),
					'not_found'                  	=> __( 'No slide groups found.' ),
					'menu_name'                  	=> __( 'Slide Groups' ),
				),
				'show_ui'               => true,
				'show_admin_column'     => true,
				'update_count_callback'	=> '_update_post_term_count',
				'query_var'             => true,
				'rewrite'               => array( 'slug' => 'slide-group' )
			)
		);

		// REGISTER THE TAXONOMY TO THE POST TYPE
		register_taxonomy_for_object_type( 'bamboo_slide_group', 'bamboo_slide' );

}

/************************************************************************************************************/

	add_action( 'admin_init', 'bamboo_slides_add_meta_boxes' );
	function bamboo_slides_add_meta_boxes() {

		// ADD THE ALIGNMENT PICKERS TO THE SIDE AREA OF THE EDITOR
		add_meta_box(
			'alignment_picker',
			'Text Alignment',
			'bamboo_slides_render_alignment_picker',
			'bamboo_slide',
			'side'
		);
		add_meta_box(
			'vertical_alignment_picker',
			'Vertical Alignment',
			'bamboo_slides_render_vertical_alignment_picker',
			'bamboo_slide',
			'side'
		);

		// ADD THE LINK EDITOR TO THE MAIN AREA OF THE EDITOR
		add_meta_box(
			'link_editor',
			'Link URL <em>(leave this blank if there are links in the banner content)</em>',
			'bamboo_slides_render_link_editor' ,
			'bamboo_slide',
			'normal'
		);

	}

/************************************************************************************************************/

	add_action( 'save_post', 'bamboo_slides_save_post' );
	function bamboo_slides_save_post() {

		if ( sizeof($_POST)==0 ) {
			return;
		}

		if ( !isset( $_POST['post_type'] ) ) {
			return;
		}

		if ( 'bamboo_slide' != $_POST['post_type'] ) {
	        	return;
	    	}

	    if( isset( $_REQUEST['alignment'] ) ) {
			update_post_meta( $_REQUEST['post_ID'], 'alignment', $_REQUEST['alignment'] );
		}

	    if( isset( $_REQUEST['vertical_alignment'] ) ) {
			update_post_meta( $_REQUEST['post_ID'], 'vertical_alignment', $_REQUEST['vertical_alignment'] );
		}

	    if( isset( $_REQUEST['link_url'] ) ) {
			update_post_meta( $_REQUEST['post_ID'], 'link_url', $_REQUEST['link_url'] );
		}

	}

/************************************************************************************************************/

	add_action( 'wp_enqueue_scripts', 'bamboo_slides_enqueue_styles' );
	function bamboo_slides_enqueue_styles() {

		// ENQUEUE STYLESHEETS
		$path = plugins_url( '', __FILE__ );

		if( function_exists( 'bamboo_enqueue_style' ) ) {
			bamboo_enqueue_style( 'bamboo-slides', $path . '/bamboo-slides.css' );
		} else {
			wp_enqueue_style( 'bamboo-slides', $path . '/bamboo-slides.css' );
		}

	    // ENQUEUE JAVASCRIPT
		wp_enqueue_script( 'jquery' );
		wp_enqueue_script( 'jquery.velocity', $path.'/jquery.velocity.min.js', 'jquery', null, true );
		wp_enqueue_script( 'bamboo-slides', $path.'/bamboo-slides.min.js', 'jquery', null, true );

	}

/************************************************************************************************************/

	add_shortcode( 'bamboo-slides', 'bamboo_slides_shortcode' );
	function bamboo_slides_shortcode( $atts, $content=null ) {

		// ESTABLISH THE ATTRIBUTE VALUES
		$mode = "jump";
		if ( isset( $atts["mode"] ) ) $mode = $atts["mode"];

		$timer = "0";
		if ( isset( $atts["timer"] ) ) $timer = $atts["timer"];

		$group = "";
		if ( isset( $atts["group"] ) ) $group = $atts["group"];

		$buttons = false;
		if ( isset( $atts["buttons"] ) ) $buttons = true;

		$start = "1";
		if ( isset( $atts["start"] ) ) $start = $atts["start"];

		$indicators = false;
		if ( isset( $atts["indicators"] ) ) $indicators = true;

		// PROVIDE AN ACTION HOOK DIRECTLY BEFORE THE SLIDES
		do_action( 'before_bamboo_slides' );

		// QUERY THE SLIDES
		$args = array(
			'post_type'=>'bamboo_slide',
			'orderby'=>'title',
			'order'=>'ASC',
			'posts_per_page'=>'-1'
		);

		if( ""!=$group ) {
			$args['bamboo_slide_group'] = $group;
		}

		// SLIDES LOOP
		$html = '';
		$slide_count = 0;
		$loop = new WP_Query( $args );
		while ($loop->have_posts()) : $loop->the_post();

			// GET THE ID OF THE SLIDE
			$id = get_the_ID();

			// ESTABLISH THE BACKGROUND STYLE FOR THE SLIDE
			$background = '';
			if( has_post_thumbnail( $id ) ) {
				$url = wp_get_attachment_image_src( get_post_thumbnail_id( $id ), 'single-post-thumbnail' );
				$url = str_replace( home_url(), '', $url);
				$background = ' style="background: url(' . $url[0] . ') no-repeat center center; background-size: cover;" ';
			}

			// ESTABLISH IF THE SLIDE HAS A LINK URL
			$url = get_post_meta( $id, 'link_url', true );

			// ESTABLISH THE ALIGNMENT OF THE SLIDE
			$alignment = get_post_meta( $id, 'alignment', true );

			// ESTABLISH THE VERTICAL ALIGNMENT OF THE SLIDE
			$vertical_alignment = get_post_meta( $id, 'vertical_alignment', true );

			// ESTABLISH THE CLASSES FOR THE SLIDE
			$classes="bamboo-slide";
			if( ''!=$alignment ) {
				$classes.=" aligned-$alignment";
			}
			if( ''!=$vertical_alignment ) {
				$classes.=" vertical-aligned-$vertical_alignment";
			}

			// CREATE THE HTML FOR THE SLIDE
			if( $url!='' ) {
				$html.= "<a class=\"$classes\"$background href=\"$url\">";
			} else {
				$html.= "<div class=\"$classes\"$background>";
			}
			$html.="<div class=\"bamboo-slide-content\">";
			$html.= do_shortcode( get_the_content() );
			$html.="</div>";
			if( $url!='' ) {
				$html.= "</a>";
			} else {
				$html.= "</div>";
			}

			// IINCREMENT THE SLIDE COUNT
			$slide_count++;

		// END OF THE SLIDES LOOP
		endwhile;

		// RESET THE WP QUERY
		wp_reset_query();

		// IF THERE IS ONLY ONE SLIDE DISABLE THE TIMER AND RESET THE START SLIDE TO 1
		if( 2>$slide_count ) {
			$timer = 0;
			$start = 1;
		}

		// ADD BUTTONS TO THE HTML IF REQUIRED
		if( $buttons && ( 1<$slide_count ) ) {
			$html.= "<div class=\"bamboo-slides-prev-button\">A</div>";
			$html.= "<div class=\"bamboo-slides-next-button\">D</div>";
		}

		// ADD INDICATORS TO THE HTML IF REQUIRED
		if( $indicators && ( 1<$slide_count ) ) {
			$html.= "<div class=\"bamboo-slides-indicators\"></div>";
		}

		// WRAP THE HTML FOR THE SLIDES WITH THE CONTAINER HTML
		$html = "<div class=\"bamboo-slides color-0 mode-$mode timer-$timer start-$start\" style=\"visibility: hidden;\">$html</div>";

		// PROVIDE AN ACTION HOOK DIRECTLY AFTER THE SLIDES
		do_action( 'after_bamboo_slides' );

		// RETURN THE HTML
		return $html;

	}

/************************************************************************************************************/

	function bamboo_slides_render_alignment_picker() {

		global $post;

		$value = get_post_meta( $post->ID, 'alignment', true );

		$none_selected    =  ( ''   	 ==$value ) ? 'selected="selected"' : '';
		$left_selected     = ( 'left'    ==$value ) ? 'selected="selected"' : '';
		$right_selected    = ( 'right'   ==$value ) ? 'selected="selected"' : '';

		echo "<label class=\"selectit\" for=\"alignment\"></label>";
		echo "<select name=\"alignment\" id=\"alignment\" >";
		echo "<option value=\"\" $none_selected >None</option>";
		echo "<option value=\"left\" $left_selected >Left aligned</option>";
		echo "<option value=\"right\" $right_selected>Right aligned</option>";
		echo "</select>";
		echo "<div style='clear:both; display:block;'></div>";

	}

/********************************************************************************************************/

	function bamboo_slides_render_vertical_alignment_picker() {

		global $post;

		$value = get_post_meta( $post->ID, 'vertical_alignment', true );

		$none_selected    =  ( ''   	 ==$value ) ? 'selected="selected"' : '';
		$middle_selected     = ( 'middle'    ==$value ) ? 'selected="selected"' : '';
		$bottom_selected    = ( 'bottom'   ==$value ) ? 'selected="selected"' : '';

		echo "<label class=\"selectit\" for=\"vertical_alignment\"></label>";
		echo "<select name=\"vertical_alignment\" id=\"vertical_alignment\" >";
		echo "<option value=\"\" $none_selected >None</option>";
		echo "<option value=\"middle\" $middle_selected >Middle</option>";
		echo "<option value=\"bottom\" $bottom_selected>Bottom</option>";
		echo "</select>";
		echo "<div style='clear:both; display:block;'></div>";

	}

/********************************************************************************************************/

	function bamboo_slides_render_link_editor() {

		global $post;

		$value = get_post_meta( $post->ID, 'link_url', true );

		echo "<label class=\"selectit\" for=\"link_url\"></label><input type=\"text\" value=\"$value\" name=\"link_url\" id=\"link_url\" />";
		echo "<div style='clear:both; display:block;'></div>";

	}

/********************************************************************************************************/
?>
