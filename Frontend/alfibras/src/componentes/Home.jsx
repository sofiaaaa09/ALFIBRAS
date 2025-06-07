import React, { useState, useEffect, useRef } from "react";
import { FaFacebook, FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Definición de animaciones
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};


const useInView = () => {
  const [ref, setRef] = useState(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref]);

  return [setRef, inView];
};

const AnimatedSection = ({ children, id }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 }
      }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.section>
  );
};

const Home = () => {
  // Referencias para scroll
  const productosRef = useRef(null);
  const nosotrosRef = useRef(null);
  

  const sliderData = [
    { 
      id: '1', 
      title: 'Bienvenido a Alfibras', 
      subtitle: 'Productos de fibra de vidrio de alta calidad',
      imageUrl: 'https://rejiglass.com.mx/wp-content/uploads/2022/02/Como-trabajar-la-fibra-de-vidrio.jpg',
      cta: 'Ver productos',
      action: () => productosRef.current.scrollIntoView({ behavior: 'smooth' })
    },
    { 
      id: '2', 
      title: 'Soluciones Personalizadas', 
      subtitle: 'Diseños a medida para tus necesidades',
      imageUrl: 'https://www.plaremesa.net/wp-content/uploads/2021/05/como-cortar-fibra-de-vidrio.jpg',
      cta: 'Solicitar cotización',
      action: () => window.open('https://wa.me/573123456789', '_blank')
    },
    { 
      id: '3', 
      title: 'Expertos en Fibra de Vidrio', 
      subtitle: 'Más de 10 años de experiencia en el sector',
      imageUrl: 'https://www.a-alvarez.com/img/ybc_blog/post/repararbarco-e1666702460178.jpg',
      cta: 'Conoce más',
      action: () => nosotrosRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  ];


  const productSliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const [currentSlide, setCurrentSlide] = useState(0);

 
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", overflowX: 'hidden' }}>
      {/* Slider de Bienvenida */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
      }}>
        {sliderData.map((slide, index) => (
          <motion.div 
            key={slide.id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${slide.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: index === currentSlide ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              textAlign: 'center',
              padding: '0 20px',
            }}
            animate={{
              scale: index === currentSlide ? 1 : 1.05,
              transition: { duration: 8 }
            }}
          >
            <motion.h1 
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                fontWeight: '700',
                marginBottom: '20px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: index === currentSlide ? 1 : 0,
                y: index === currentSlide ? 0 : 30
              }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {slide.title}
            </motion.h1>
            
            <motion.p 
              style={{
                fontSize: 'clamp(1.2rem, 2vw, 1.8rem)',
                maxWidth: '800px',
                marginBottom: '40px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: index === currentSlide ? 1 : 0,
                y: index === currentSlide ? 0 : 30
              }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {slide.subtitle}
            </motion.p>
            
            <motion.button 
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid white',
                padding: '15px 30px',
                fontSize: '1.2rem',
                borderRadius: '50px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: '600',
                letterSpacing: '1px',
              }}
              whileHover={{
                backgroundColor: 'white',
                color: '#2C3E50',
                scale: 1.05
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: index === currentSlide ? 1 : 0,
                y: index === currentSlide ? 0 : 30
              }}
              transition={{ duration: 0.8, delay: 0.7 }}
              onClick={slide.action}
            >
              {slide.cta}
            </motion.button>
          </motion.div>
        ))}
        
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
          zIndex: 10
        }}>
          {sliderData.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: '15px',
                height: '15px',
                borderRadius: '50%',
                border: '2px solid white',
                cursor: 'pointer',
                backgroundColor: index === currentSlide ? 'white' : 'transparent',
                transition: 'all 0.3s ease',
              }}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      </div>

      {/* Sección Nosotros */}
      <AnimatedSection id="nosotros">
        <div style={{
          padding: '100px 20px',
          backgroundColor: '#f8f9fa',
        }} ref={nosotrosRef}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
          }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 style={{
                textAlign: 'center',
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                color: '#2C3E50',
                marginBottom: '50px',
                position: 'relative',
                display: 'inline-block',
              }}>
                ¿Quiénes Somos?
                <span style={{
                  content: '""',
                  position: 'absolute',
                  bottom: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px',
                  height: '4px',
                  backgroundColor: '#2C3E50',
                  borderRadius: '2px'
                }}></span>
              </h2>
            </motion.div>
            
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '40px',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <motion.div 
                style={{
                  flex: '1',
                  minWidth: '300px',
                  padding: '20px',
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  visible: { opacity: 1, x: 0 },
                  hidden: { opacity: 0, x: -50 }
                }}
                transition={{ duration: 0.6 }}
              >
                <p style={{
                  fontSize: '1.1rem',
                  lineHeight: '1.8',
                  color: '#333',
                  textAlign: 'justify',
                  marginBottom: '20px'
                }}>
                  Alfibras es una empresa con una sólida trayectoria en la fabricación y comercialización de productos de fibra de vidrio, destacándose en diversos sectores como el industrial, automotriz y de construcción.
                </p>
                <p style={{
                  fontSize: '1.1rem',
                  lineHeight: '1.8',
                  color: '#333',
                  textAlign: 'justify'
                }}>
                  En el sector industrial, ofrecemos soluciones robustas que cumplen con los más altos estándares de durabilidad y rendimiento. Para el sector automotriz, nuestros componentes mejoran el rendimiento y la estética de los vehículos.
                </p>
              </motion.div>
              
              <motion.div 
                style={{
                  flex: '1',
                  minWidth: '300px',
                  height: '400px',
                  backgroundImage: 'url(https://www.tanquesenfibradevidrio.com/images/normas%20y%20m%C3%A9todos%20de%20fabricaci%C3%B3n.jpeg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '10px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  visible: { opacity: 1, x: 0, rotate: 0 },
                  hidden: { opacity: 0, x: 50, rotate: 5 }
                }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
              />
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Sección Misión y Visión */}
      <AnimatedSection>
        <div style={{
          padding: '100px 20px',
          backgroundColor: '#2C3E50',
          color: 'white',
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
          }}>
            <motion.h2
              style={{
                textAlign: 'center',
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                marginBottom: '70px',
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              Nuestra Filosofía
            </motion.h2>
            
            <motion.div 
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '40px',
                justifyContent: 'center',
              }}
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {/* Misión */}
              <motion.div 
                style={{
                  flex: '1',
                  minWidth: '300px',
                  backgroundColor: '#34495E',
                  padding: '40px',
                  borderRadius: '10px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                }}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
              >
                <div style={{
                  width: '70px',
                  height: '70px',
                  backgroundColor: '#2C3E50',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: '0 auto 25px',
                  fontSize: '1.8rem'
                }}>
                  🎯
                </div>
                <h3 style={{
                  fontSize: '1.8rem',
                  marginBottom: '20px',
                  textAlign: 'center',
                  position: 'relative',
                  paddingBottom: '15px',
                }}>
                  Misión
                  <span style={{
                    content: '""',
                    position: 'absolute',
                    bottom: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '50px',
                    height: '3px',
                    backgroundColor: '#fff'
                  }}></span>
                </h3>
                <p style={{
                  fontSize: '1.1rem',
                  lineHeight: '1.8',
                  textAlign: 'center'
                }}>
                  ALFIBRAS es una microempresa, que busca proporcionar productos en fibra de vidrio, acorde con las exigencias del mercado satisfaciendo los gustos y expectativas de los consumidores, permitiendo el crecimiento institucional e integrarnos en la búsqueda de un desarrollo nacional.
                </p>
              </motion.div>
              
              {/* Visión */}
              <motion.div 
                style={{
                  flex: '1',
                  minWidth: '300px',
                  backgroundColor: '#34495E',
                  padding: '40px',
                  borderRadius: '10px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                }}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
              >
                <div style={{
                  width: '70px',
                  height: '70px',
                  backgroundColor: '#2C3E50',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: '0 auto 25px',
                  fontSize: '1.8rem'
                }}>
                  🔭
                </div>
                <h3 style={{
                  fontSize: '1.8rem',
                  marginBottom: '20px',
                  textAlign: 'center',
                  position: 'relative',
                  paddingBottom: '15px',
                }}>
                  Visión
                  <span style={{
                    content: '""',
                    position: 'absolute',
                    bottom: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '50px',
                    height: '3px',
                    backgroundColor: '#fff'
                  }}></span>
                </h3>
                <p style={{
                  fontSize: '1.1rem',
                  lineHeight: '1.8',
                  textAlign: 'center'
                }}>
                  Ser reconocidos como grandes productores de artículos en fibra de vidrio, implementando procesos de perfeccionamiento e innovación en el mercado y así en un futuro convertirnos en lideres y gestores de procesos manufactureros.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Sección Nuestros Productos */}
      <AnimatedSection id="productos">
        <div style={{
          padding: '100px 20px',
          backgroundColor: '#f8f9fa',
        }} ref={productosRef}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
          }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 style={{
                textAlign: 'center',
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                color: '#2C3E50',
                marginBottom: '20px',
                position: 'relative',
                display: 'inline-block',
              }}>
                Nuestros Productos
                <span style={{
                  content: '""',
                  position: 'absolute',
                  bottom: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px',
                  height: '4px',
                  backgroundColor: '#2C3E50',
                  borderRadius: '2px'
                }}></span>
              </h2>
              <p style={{
                textAlign: 'center',
                fontSize: '1.2rem',
                marginBottom: '50px',
                color: '#666'
              }}>
                Personaliza productos únicos y con la mejor calidad.
              </p>
            </motion.div>
            
            {/* Slider de productos mejorado */}
            <div style={{ 
              padding: '20px 0',
              margin: '0 auto'
            }}>
              <Slider {...productSliderSettings}>
                {/* Producto 1 */}
                <div style={{ padding: '0 15px', outline: 'none' }}>
                  <div style={{ 
                    background: 'white',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <img
                      src="https://cdn.shortpixel.ai/spai/q_lossy+w_977+to_auto+ret_img/sanautos.com.co/wp-content/uploads/2023/09/renault-master-plus-blanco-glacial-sanautos.jpg"
                      alt="Producto 1"
                      style={{ 
                        width: '100%',
                        height: '250px',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ padding: '25px', flex: 1 }}>
                      <h3 style={{ 
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        marginBottom: '15px',
                        color: '#2C3E50'
                      }}>
                        Trafic techo alto
                      </h3>
                      <p style={{ 
                        color: '#666',
                        lineHeight: '1.6',
                        marginBottom: '20px'
                      }}>
                        Esta renault TRAFIC viene con los últimos sistemas de seguridad. Entre estos, el ESP de última generación asegura la estabilidad del vehículo.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Producto 2 */}
                <div style={{ padding: '0 15px', outline: 'none' }}>
                  <div style={{ 
                    background: 'white',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <img
                      src="https://sanautos.com.co/wp-content/uploads/2023/09/renault-trafic-techo-bajo-blanco-glacial-sanautos.jpg"
                      alt="Producto 2"
                      style={{ 
                        width: '100%',
                        height: '250px',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ padding: '25px', flex: 1 }}>
                      <h3 style={{ 
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        marginBottom: '15px',
                        color: '#2C3E50'
                      }}>
                        Trafic techo bajo
                      </h3>
                      <p style={{ 
                        color: '#666',
                        lineHeight: '1.6',
                        marginBottom: '20px'
                      }}>
                        Renault TRAFIC viene con los últimos sistemas de seguridad. Entre estos, el ESP de última generación asegura la estabilidad del vehículo.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Producto 3 */}
                <div style={{ padding: '0 15px', outline: 'none' }}>
                  <div style={{ 
                    background: 'white',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <img
                      src="https://36580daefdd0e4c6740b-4fe617358557d0f7b1aac6516479e176.ssl.cf1.rackcdn.com/products/19001.14779.jpg"
                      alt="Producto 3"
                      style={{ 
                        width: '100%',
                        height: '250px',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ padding: '25px', flex: 1 }}>
                      <h3 style={{ 
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        marginBottom: '15px',
                        color: '#2C3E50'
                      }}>
                        Macetas
                      </h3>
                      <p style={{ 
                        color: '#666',
                        lineHeight: '1.6',
                        marginBottom: '20px'
                      }}>
                        Macetas hechas en fibra de vidrio son ligeras y de larga duración debido a su alta relación de resistencia-peso y resistencia a duras condiciones climáticas.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Producto 4 */}
                <div style={{ padding: '0 15px', outline: 'none' }}>
                  <div style={{ 
                    background: 'white',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <img
                      src="https://cloud.corferias.co/service/vitrina_virtual/product_image.cfm?id=45367&shop_id=10&type=2"
                      alt="Producto 4"
                      style={{ 
                        width: '100%',
                        height: '250px',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ padding: '25px', flex: 1 }}>
                      <h3 style={{ 
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        marginBottom: '15px',
                        color: '#2C3E50'
                      }}>
                        Silletería
                      </h3>
                      <p style={{ 
                        color: '#666',
                        lineHeight: '1.6',
                        marginBottom: '20px'
                      }}>
                        Alfibras incluye en su línea de servicios la adecuación interna para vehículos de transporte público.
                      </p>
                    </div>
                  </div>
                </div>
              </Slider>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Sección Contáctanos (con mapa) */}
      <AnimatedSection id="contacto">
        <div style={{
          padding: '100px 20px',
          backgroundColor: '#2C3E50',
          color: 'white',
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '40px',
            justifyContent: 'space-between',
          }}>
            <motion.div 
              style={{
                flex: '1',
                minWidth: '300px',
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { opacity: 1, x: 0 },
                hidden: { opacity: 0, x: -50 }
              }}
              transition={{ duration: 0.6 }}
            >
              <h2 style={{
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                marginBottom: '30px',
                position: 'relative',
                display: 'inline-block',
              }}>
                Contáctanos
                <span style={{
                  content: '""',
                  position: 'absolute',
                  bottom: '-15px',
                  left: '0',
                  width: '80px',
                  height: '4px',
                  backgroundColor: 'white',
                  borderRadius: '2px'
                }}></span>
              </h2>
              
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <FaMapMarkerAlt /> Dirección
                </h3>
                <p style={{
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  paddingLeft: '30px'
                }}>
                  Cl. 65a #111b73, Bogotá, Colombia
                </p>
              </div>
              
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <FaPhone /> Teléfono
                </h3>
                <p style={{
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  paddingLeft: '30px'
                }}>
                  +57 123 456 7890
                </p>
              </div>
              
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <FaEnvelope /> Email
                </h3>
                <p style={{
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  paddingLeft: '30px'
                }}>
                  info@alfibras.com
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              style={{
                flex: '1',
                minWidth: '300px',
                height: '400px',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 15px 35px rgba(0,0,0,0.2)'
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { opacity: 1, x: 0 },
                hidden: { opacity: 0, x: 50 }
              }}
              transition={{ duration: 0.6 }}
            >
              {/* Mapa de Google embebido */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.785244606093!2d-74.0839079246835!3d4.638254942330719!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9a3e2e7a8b3f%3A0x1a3b3b3b3b3b3b3b!2sCl.%2065a%20%23111b-73%2C%20Bogot%C3%A1!5e0!3m2!1sen!2sco!4v1620000000000!5m2!1sen!2sco" 
                width="100%" 
                height="100%" 
                style={{ border: 'none' }}
                allowFullScreen="" 
                loading="lazy"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Sección Horarios de Atención */}
      <AnimatedSection>
        <div style={{
          padding: '80px 20px',
          backgroundColor: '#f8f9fa',
          color: '#2C3E50',
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                marginBottom: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '15px'
              }}
            >
              <FaClock /> Horarios de Atención
            </motion.h2>
            
            <motion.div 
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '40px',
                marginTop: '40px'
              }}
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div 
                style={{
                  backgroundColor: 'white',
                  padding: '40px 30px',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  minWidth: '250px',
                  flex: '1'
                }}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
              >
                <h3 style={{
                  fontSize: '1.8rem',
                  marginBottom: '20px',
                  color: '#2C3E50'
                }}>Lunes a Viernes</h3>
                <p style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#34495E'
                }}>8:00 AM - 6:00 PM</p>
              </motion.div>
              
              <motion.div 
                style={{
                  backgroundColor: 'white',
                  padding: '40px 30px',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  minWidth: '250px',
                  flex: '1'
                }}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
              >
                <h3 style={{
                  fontSize: '1.8rem',
                  marginBottom: '20px',
                  color: '#2C3E50'
                }}>Sábados</h3>
                <p style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#34495E'
                }}>9:00 AM - 2:00 PM</p>
              </motion.div>
              
              <motion.div 
                style={{
                  backgroundColor: 'white',
                  padding: '40px 30px',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  minWidth: '250px',
                  flex: '1'
                }}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
              >
                <h3 style={{
                  fontSize: '1.8rem',
                  marginBottom: '20px',
                  color: '#2C3E50'
                }}>Domingos</h3>
                <p style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#34495E'
                }}>Cerrado</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Sección Redes Sociales */}
      <AnimatedSection>
        <div style={{
          padding: '80px 20px',
          backgroundColor: '#2C3E50',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                marginBottom: '40px',
                position: 'relative',
                display: 'inline-block',
              }}
            >
              Síguenos en Redes
              <span style={{
                content: '""',
                position: 'absolute',
                bottom: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '4px',
                backgroundColor: 'white',
                borderRadius: '2px'
              }}></span>
            </motion.h2>
            
            <motion.div 
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '40px',
                flexWrap: 'wrap',
                marginTop: '40px'
              }}
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.a 
                href="#" 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'white',
                }}
                variants={fadeInUp}
                whileHover={{ 
                  y: -5,
                  scale: 1.05
                }}
              >
                <div style={{
                  width: '90px',
                  height: '90px',
                  backgroundColor: '#4267B2',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: '15px',
                  fontSize: '2.5rem'
                }}>
                  <FaFacebook />
                </div>
                <span style={{ fontSize: '1.2rem' }}>Facebook</span>
              </motion.a>
              
              <motion.a 
                href="#" 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'white',
                }}
                variants={fadeInUp}
                whileHover={{ 
                  y: -5,
                  scale: 1.05
                }}
              >
                <div style={{
                  width: '90px',
                  height: '90px',
                  backgroundColor: '#E1306C',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: '15px',
                  fontSize: '2.5rem'
                }}>
                  <FaInstagram />
                </div>
                <span style={{ fontSize: '1.2rem' }}>Instagram</span>
              </motion.a>
              
              <motion.a 
                href="https://wa.me/573123456789" 
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'white',
                }}
                variants={fadeInUp}
                whileHover={{ 
                  y: -5,
                  scale: 1.05
                }}
              >
                <div style={{
                  width: '90px',
                  height: '90px',
                  backgroundColor: '#25D366',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: '15px',
                  fontSize: '2.5rem'
                }}>
                  <FaWhatsapp />
                </div>
                <span style={{ fontSize: '1.2rem' }}>WhatsApp</span>
              </motion.a>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Home;