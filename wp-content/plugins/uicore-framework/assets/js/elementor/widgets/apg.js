window.addEventListener('DOMContentLoaded', () => {
    class APG extends elementorModules.frontend.handlers.Base {
        bindEvents(){
            if(this.getElementSettings('animate_items') == 'ui-e-grid-animate'){
                this.setIndex();
                this.animate();
            }

            if(this.getElementSettings('masonry') == 'ui-e-maso'){
                this.doMaso();
                let _this = this;
                jQuery(window).on('resize', function () {
                    _this.doMaso();
                });
            }
        }
        getDefaultElements() {
            return {
                $grid: this.$element.find('.ui-e-adv-grid'),
                $items: this.$element.find('.ui-e-post-item'),
            };
        }
        onElementChange(propertyName) {
            if (0 === propertyName.indexOf('animate_')) {
                this.elements.$items.attr('class','ui-e-post-item elementor-invisible')
                setTimeout(() => {
                    this.animate();
                }, 200);
                return;
            }

            if(propertyName == 'columns'){
                this.setIndex();
            }

            if(!['content_bg'].includes(propertyName) && 0 != propertyName.indexOf('animate_')){

                //TODO - CONTINUE ONLY FOR PROPERTY THAT MAY CHANGE THE HEIGHT !!!!!
                const isMaso = (this.getElementSettings('masonry') == 'ui-e-maso' ? true : false);
                if (isMaso) {

                    this.doMaso();
                    this.animate();
                    return;
                }else{
                    this.$element.removeClass('ui-e-maso');
                }
            }

        }
        animate() {
            let animationName = this.getElementSettings('animate_item_type');
            if(animationName)
            this.elements.$items.each((i, el) => {
                    new Waypoint({
                        element: el,
                        handler: function (direction) {
                            el.classList.remove('elementor-invisible');
                            el.classList.add('ui-e-animated');
                            el.classList.add(animationName);
                        },
                        offset: "90%",
                    });
            })
        }
        doMaso() {

            this.$element.addClass('ui-e-maso');
            let col = this.elements.$grid.css("grid-template-columns").split(" ").length
            let gap = Math.floor(this.elements.$grid.css("gap").split(' ')[0].slice(0, -2))
            this.elements.$items.css('margin-top','');
            this.elements.$items.each((i, el) => {
                if (i + 1 > col) {
                    var prev_fin = this.elements.$items[i - col].getBoundingClientRect().bottom;
                    var curr_ini = this.elements.$items[i].getBoundingClientRect().top;
                    el.style.marginTop = `${prev_fin + gap - curr_ini}px`
                } else {
                    el.style.removeProperty('margin-top');
                }
            })
        }
        setIndex(){
            var col = this.elements.$grid.css("grid-template-columns").split(" ").length
            this.elements.$items.each((i, el) => {
                el.style.setProperty('---ui-index', i - Math.floor(i / col) * col);
            })
        }
    }
    jQuery(window).on('elementor/frontend/init', () => {
        const addHandler = ($element) => {
            elementorFrontend.elementsHandler.addHandler(APG, { $element, });
        };
        elementorFrontend.hooks.addAction('frontend/element_ready/uicore-advanced-post-grid.default', addHandler);
    });
}, false);
