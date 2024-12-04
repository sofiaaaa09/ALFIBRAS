import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";

function Productos() {
  // Configuración del slider de productos
  const settings = {
    dots: true, // Puntos de navegación
    infinite: true, // Ciclo infinito
    speed: 500, // Velocidad de transición
    slidesToShow: 3, // Cantidad de productos visibles
    slidesToScroll: 1, // Productos que se desplazan por clic
    arrows: true, // Habilitar flechas
    responsive: [
      {
        breakpoint: 768, // En pantallas más pequeñas
        settings: {
          slidesToShow: 1, // Mostrar solo un producto
        },
      },
      {
        breakpoint: 1024, // En tablets
        settings: {
          slidesToShow: 2, // Mostrar dos productos
        },
      },
    ],
  };

  // Función para agregar un producto al carrito
  const agregarAlCarrito = async (productoId, cantidad) => {
    try {
      const response = await axios.post("http://localhost:9001/api/carrito", {
        producto_id: productoId,
        cantidad: cantidad,
      });
      console.log("Producto agregado al carrito", response.data);
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    }
  };

  return (
    <div id="productos" className="container my-5">
      <h2 className="text-center" style={{ color: "#34495E" }}>
        PRODUCTOS
      </h2>
      <p className="text-center">
        Personaliza productos únicos y con la mejor calidad.
      </p>
      <Slider {...settings}>
        {/* Producto 1 */}
        <div>
          <div className="card mx-2">
            <img
              src="https://cdn.shortpixel.ai/spai/q_lossy+w_977+to_auto+ret_img/sanautos.com.co/wp-content/uploads/2023/09/renault-master-plus-blanco-glacial-sanautos.jpg"
              className="card-img-top"
              alt="Producto 1"
            />
            <div className="card-body">
              <h5 className="card-title">Trafic techo alto.</h5>
              <p className="card-text">
                Esta renault TRAFIC viene con los últimos sistemas de seguridad.
                Entre estos, el ESP de última generación asegura la estabilidad
                del vehículo y ayuda a mantenerlo en el curso.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => agregarAlCarrito("productoId1", 1)}
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>

        {/* Producto 2 */}
        <div>
          <div className="card mx-2">
            <img
              src="https://sanautos.com.co/wp-content/uploads/2023/09/renault-trafic-techo-bajo-blanco-glacial-sanautos.jpg"
              className="card-img-top"
              alt="Producto 2"
            />
            <div className="card-body">
              <h5 className="card-title">Trafic techo bajo.</h5>
              <p className="card-text">
                Renault TRAFIC viene con los últimos sistemas de seguridad.
                Entre estos, el ESP de última generación asegura la estabilidad
                del vehículo y ayuda a mantenerlo en el curso.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => agregarAlCarrito("productoId2", 1)}
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>

        {/* Producto 3 */}
        <div>
          <div className="card mx-2">
            <img
              src="https://36580daefdd0e4c6740b-4fe617358557d0f7b1aac6516479e176.ssl.cf1.rackcdn.com/products/19001.14779.jpg"
              className="card-img-top"
              alt="Producto 3"
            />
            <div className="card-body">
              <h5 className="card-title">Maceta.</h5>
              <p className="card-text">
                Macetas hechas en fibra de vidrio son ligeras y de larga duración
                debido a su alta relación de resistencia-peso y a su resistencia a
                duras condiciones climáticas.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => agregarAlCarrito("productoId3", 1)}
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>

        {/* Producto 4 */}
        <div>
          <div className="card mx-2">
            <img
              src="https://cloud.corferias.co/service/vitrina_virtual/product_image.cfm?id=45367&shop_id=10&type=2"
              className="card-img-top"
              alt="Producto 4"
            />
            <div className="card-body">
              <h5 className="card-title">Silleteria.</h5>
              <p className="card-text">
                Alfibras incluye en su línea de servicios la adecuación interna
                para vehículos de transporte público.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => agregarAlCarrito("productoId4", 1)}
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </Slider>
    </div>
  );
}

export default Productos;

