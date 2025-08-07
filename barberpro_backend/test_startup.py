#!/usr/bin/env python3
"""
Script de teste para verificar se o backend pode ser iniciado sem erros.
"""

import sys
import os

# Adicionar o diretório src ao path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

try:
    print("Testando importação dos modelos...")
    from models.client import Client
    from models.barber import Barber
    from models.service import Service
    from models.appointment import Appointment
    print("✓ Modelos importados com sucesso")
    
    print("Testando importação das rotas...")
    from routes.auth import auth_bp
    from routes.client import client_bp
    from routes.barber import barber_bp
    from routes.service import service_bp
    from routes.appointment import appointment_bp
    print("✓ Rotas importadas com sucesso")
    
    print("Testando criação da aplicação Flask...")
    from main import app
    print("✓ Aplicação Flask criada com sucesso")
    
    print("Testando configuração da aplicação...")
    with app.app_context():
        print(f"✓ App configurado: {app.name}")
        print(f"✓ Blueprints registrados: {len(app.blueprints)}")
    
    print("\n🎉 Todos os testes passaram! O backend está pronto para ser executado.")
    
except Exception as e:
    print(f"❌ Erro durante o teste: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

