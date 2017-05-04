=== Bamboo Slides ===
Contributors: bamboosolutions
Donate link: https://www.bamboomanchester.uk
Tags: slides, sliders, banners, slideshows, shortcodes
Requires at least: 3.0.1
Tested up to: 4.7
Stable tag: 1.9.8
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

With three different animation styles, Bamboo Slides allows you to incorporate a cool looking interactive banner or slideshow into any page – no coding or Flash required.

== Description ==

This plugin adds a ‘Slide’ post type to WordPress. These work like normal posts, and can be grouped into ‘Slide Groups’ which work just like post categories. Once you have created all your slides in the appropriate groups, you can add a slider to any page or post by using the bamboo-slides’ shortcode. You can have multiple sliders on one page, and they can be anywhere you like, so they work just as well for footers as they do for banners.

Each slide can contain any type of content that a post can, and depending on the chosen mode, the slides will be switched , faded, or slid into view. Slides can also have a feature image, which if supplied will be used as the background image for the slide.

Usage

Insert the ’bamboo-slides’ shortcode into your content as follows:

    [bamboo-slides group=homepage slides timer=4 buttons=on indicators=on mode=fade]

All of the attributes are optional, with the following possible values:

group
Selects the group of slides to display, if not set all the slides will be displayed regardless of which group they are in

timer
Number of seconds to wait between each slide, if set to 0 the slides will only change when the buttons are used

buttons
If this is set then the slides will have buttons enabling the user to advance the slides manually

indicators
If this is set then the slides will have indicators at the bottom indicating the current slide

mode
switch		Simple switch from one slide to next
fade		Fade each slide in and out
slide_left	Slide from right to left
slide_right	Slide from left to right

== Changelog ==

= 1.9.8 =
* Tested in WP4.7 and rebranded.
